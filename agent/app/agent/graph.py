from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage, ToolMessage
from langgraph.graph import StateGraph, START, END
from typing import TypedDict, Annotated
import operator

from app.config import OLLAMA_API_KEY
from app.supabase_client import get_client
from app.agent.persona import build_system_prompt
from app.agent.tools import (
    get_services,
    check_availability,
    create_booking,
    create_order,
    escalate,
)

MAX_ITERATIONS = 5

# COMPLETE TOOL LIST — no other tools exist or should be added.
# - get_services:     read-only catalog lookup (SELECT only)
# - check_availability: read-only slot check (SELECT only)
# - create_booking:   writes a booking row via RPC
# - create_order:     writes an order row via RPC
# - escalate:         updates conversation status to human
TOOLS = [get_services, check_availability, create_booking, create_order, escalate]
TOOLS_BY_NAME = {t.name: t for t in TOOLS}

# Tools that receive contact_id automatically (the model never supplies it)
_CONTACT_TOOLS = {"create_booking", "create_order"}


class AgentState(TypedDict):
    system_prompt: str
    messages: Annotated[list, operator.add]
    reply: str
    tenant_id: str
    conversation_id: str
    contact_id: str
    is_first_message: bool
    iteration_count: int
    fallback_message: str


def _tools_node(state: AgentState) -> dict:
    last_message = state["messages"][-1]
    if not hasattr(last_message, "tool_calls") or not last_message.tool_calls:
        return {"messages": []}

    results = []
    for tool_call in last_message.tool_calls:
        tool_name = tool_call["name"]
        tool_args = dict(tool_call["args"])

        # Inject tenant_id for all tools that need it
        if tool_name in ("get_services", "check_availability", "create_booking", "create_order"):
            tool_args["tenant_id"] = state["tenant_id"]
        elif tool_name == "escalate":
            tool_args["tenant_id"] = state["tenant_id"]
            tool_args["conversation_id"] = state["conversation_id"]

        # Inject contact_id automatically — the model never supplies it
        if tool_name in _CONTACT_TOOLS:
            tool_args["contact_id"] = state["contact_id"]

        tool = TOOLS_BY_NAME[tool_name]
        print(f"[TOOL CALL] {tool_name}({tool_args})")
        result = tool.invoke(tool_args)
        print(f"[TOOL RESULT] {tool_name} -> {result}")

        # If a technical error occurred, auto-escalate
        if isinstance(result, str) and result.startswith("TECHNICAL_ERROR:"):
            print(f"[AUTO-ESCALATE] Technical error in {tool_name}, escalating")
            escalate.invoke(
                {
                    "tenant_id": state["tenant_id"],
                    "conversation_id": state["conversation_id"],
                    "reason": "cant_answer",
                }
            )
            result = (
                "I'm sorry, I'm having a technical issue right now. "
                "I've connected you with a human team member who can help. "
                "They'll be with you shortly."
            )

        results.append(
            ToolMessage(content=str(result), tool_call_id=tool_call["id"])
        )

    return {"messages": results}


def _call_model(state: AgentState) -> dict:
    llm = ChatOpenAI(
        model="gpt-oss:20b-cloud",
        api_key=OLLAMA_API_KEY,
        base_url="https://ollama.com/v1",
    )
    llm_with_tools = llm.bind_tools(TOOLS)

    # Build the full message list for the model
    lc_messages = [SystemMessage(content=state["system_prompt"])]
    for msg in state["messages"]:
        if isinstance(msg, dict):
            role = msg.get("role")
            content = msg.get("content", "")
            if role == "user":
                lc_messages.append(HumanMessage(content=content))
            elif role == "assistant":
                lc_messages.append(AIMessage(content=content))
        elif isinstance(msg, (HumanMessage, AIMessage, ToolMessage)):
            lc_messages.append(msg)

    # Call the model, catching "prompt too long" errors
    try:
        response = llm_with_tools.invoke(lc_messages)
    except Exception as exc:
        error_str = str(exc).lower()
        if "prompt" in error_str and ("too long" in error_str or "length" in error_str or "limit" in error_str or "token" in error_str):
            print(f"[ERROR] Prompt too long: {exc}")
            fallback = state.get("fallback_message", "I'm sorry, I'm having trouble right now. Let me connect you with a human team member.")
            return {
                "messages": [AIMessage(content=fallback)],
                "iteration_count": state.get("iteration_count", 0) + 1,
            }
        raise

    iteration_count = state.get("iteration_count", 0) + 1

    # Token usage for REPL display
    usage = getattr(response, "usage_metadata", None) or getattr(response, "response_metadata", {}).get("token_usage", {})
    if usage:
        print(f"[DEBUG] Token usage: {usage}")

    if iteration_count >= MAX_ITERATIONS:
        return {
            "messages": [
                AIMessage(
                    content=(
                        "I'm sorry, I'm having trouble handling this right now. "
                        "Let me connect you with a human team member who can help."
                    )
                )
            ],
            "iteration_count": iteration_count,
        }

    # If the model returned tool calls, let the tools node handle it — do NOT
    # fill empty content with a fallback, because the model is supposed to
    # follow up with a text reply AFTER the tool results come back.
    has_tool_calls = bool(getattr(response, "tool_calls", None))
    if not response.content and not has_tool_calls:
        response.content = (
            "I'm not sure how to help with that. "
            "Could you tell me more about what you're looking for?"
        )

    return {"messages": [response], "iteration_count": iteration_count}


def _should_continue(state: AgentState) -> str:
    if state.get("iteration_count", 0) >= MAX_ITERATIONS:
        return "end"
    last_message = state["messages"][-1]
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools"
    return "end"


graph = StateGraph(AgentState)
graph.add_node("agent", _call_model)
graph.add_node("tools", _tools_node)
graph.add_edge(START, "agent")
graph.add_conditional_edges("agent", _should_continue, {"tools": "tools", "end": END})
graph.add_edge("tools", "agent")

agent_graph = graph.compile()


def run_agent(
    history: list[dict],
    user_message: str,
    tenant_id: str,
    conversation_id: str,
) -> str | None:
    sb = get_client()

    # Look up conversation — if already escalated to human, skip agent entirely
    conv = (
        sb.table("conversations")
        .select("contact_id, status")
        .eq("id", conversation_id)
        .eq("tenant_id", tenant_id)
        .single()
        .execute()
    )
    contact_id = conv.data["contact_id"]

    if conv.data.get("status") == "human":
        return None  # already escalated, no reply needed

    # Determine if this is the first user message in the conversation
    is_first_message = len(history) == 0

    # Build system prompt with greeting/sign-off guidance
    system_prompt = build_system_prompt(tenant_id, is_first_message=is_first_message)

    # Look up fallback message for "prompt too long" recovery
    persona = (
        sb.table("agent_persona")
        .select("fallback_message")
        .eq("tenant_id", tenant_id)
        .single()
        .execute()
        .data
    )
    fallback_message = persona.get("fallback_message") or "I'm sorry, I'm having trouble right now. Let me connect you with a human team member."

    messages = history + [{"role": "user", "content": user_message}]
    result = agent_graph.invoke(
        {
            "system_prompt": system_prompt,
            "messages": messages,
            "reply": "",
            "tenant_id": tenant_id,
            "conversation_id": conversation_id,
            "contact_id": contact_id,
            "is_first_message": is_first_message,
            "iteration_count": 0,
            "fallback_message": fallback_message,
        }
    )

    for msg in reversed(result["messages"]):
        if isinstance(msg, AIMessage) and msg.content:
            return msg.content

    return "I'm sorry, I couldn't generate a response. Let me connect you with someone who can help."
