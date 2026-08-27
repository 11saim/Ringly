from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from langgraph.graph import StateGraph, START, END
from typing import TypedDict

from app.config import OLLAMA_API_KEY


class AgentState(TypedDict):
    system_prompt: str
    messages: list
    reply: str


def _call_model(state: AgentState) -> dict:
    llm = ChatOpenAI(
        model="gpt-oss:20b-cloud",
        api_key=OLLAMA_API_KEY,
        base_url="https://ollama.com/v1",
    )

    lc_messages = [SystemMessage(content=state["system_prompt"])]
    for msg in state["messages"]:
        if msg["role"] == "user":
            lc_messages.append(HumanMessage(content=msg["content"]))
        elif msg["role"] == "assistant":
            lc_messages.append(AIMessage(content=msg["content"]))
    lc_messages.append(HumanMessage(content=state["messages"][-1]["content"]))

    response = llm.invoke(lc_messages)
    return {"reply": response.content}


graph = StateGraph(AgentState)
graph.add_node("respond", _call_model)
graph.add_edge(START, "respond")
graph.add_edge("respond", END)

agent_graph = graph.compile()


def run_agent(system_prompt: str, history: list[dict], user_message: str) -> str:
    messages = history + [{"role": "user", "content": user_message}]
    result = agent_graph.invoke({
        "system_prompt": system_prompt,
        "messages": messages,
        "reply": "",
    })
    return result["reply"]
