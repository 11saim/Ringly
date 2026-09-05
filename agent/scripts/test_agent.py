"""Interactive REPL to test the agent with tool-calling support.

Usage: python scripts/test_agent.py <tenant_id> <contact_id>

A fresh conversation is created in the database for each run, linking
the given contact. The system prompt, contact_id lookup, and service
catalog are all handled automatically.
"""

import sys
import uuid
import io
import contextlib

sys.path.insert(0, ".")

from app.supabase_client import get_client
from app.agent.graph import run_agent, TOOLS
from app.agent.persona import build_system_prompt


def _tool_summary(tool) -> str:
    """First sentence of a tool's docstring."""
    doc = tool.description or ""
    # Take only the first line (the summary line before the blank line)
    first_line = doc.split("\n\n")[0].split("\n")[0].strip()
    # Find first sentence-ending period
    for i, ch in enumerate(first_line):
        if ch == "." and (i + 1 >= len(first_line) or first_line[i + 1] in (" ", "\n")):
            return first_line[: i + 1]
    return first_line or "(no description)"


def main():
    if len(sys.argv) < 3:
        print("Usage: python scripts/test_agent.py <tenant_id> <contact_id>")
        sys.exit(1)

    tenant_id = sys.argv[1]
    contact_id = sys.argv[2]
    conversation_id = str(uuid.uuid4())

    sb = get_client()

    # Create a real conversation row so run_agent can look up contact_id
    sb.table("conversations").insert(
        {
            "id": conversation_id,
            "tenant_id": tenant_id,
            "contact_id": contact_id,
            "status": "agent",
        }
    ).execute()

    # ── Startup banner (shown once) ────────────────────────────────
    print(f"\ntenant_id       = {tenant_id}")
    print(f"contact_id      = {contact_id}")
    print(f"conversation_id = {conversation_id}\n")

    # Build and print the full system prompt once
    system_prompt = build_system_prompt(tenant_id, is_first_message=True)
    print("=== SYSTEM PROMPT ===")
    print(system_prompt)
    print()

    # Print available tools once
    print("=== TOOLS AVAILABLE ===")
    for t in TOOLS:
        print(f"  {t.name}: {_tool_summary(t)}")
    print()

    print("=== conversation starting ===\n")
    print("Type your message and press Enter.")
    print("Type 'quit' or 'exit' to stop.\n")

    # ── REPL loop ──────────────────────────────────────────────────
    history: list[dict] = []

    while True:
        try:
            user_input = input("You: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nExiting.")
            break

        if not user_input:
            continue
        if user_input.lower() in ("quit", "exit"):
            print("Exiting.")
            break

        # Capture stdout from run_agent to extract tool calls and token usage
        buf = io.StringIO()
        with contextlib.redirect_stdout(buf):
            reply = run_agent(history, user_input, tenant_id, conversation_id)

        # If already escalated to human, skip agent display
        if reply is None:
            print("(Conversation already handed off to a human — no agent reply)\n")
            history.append({"role": "user", "content": user_input})
            continue

        # Parse captured output for tool calls and token usage
        captured = buf.getvalue()
        tool_calls = []
        token_line = ""
        for line in captured.splitlines():
            line = line.strip()
            if line.startswith("[TOOL CALL]"):
                # Format: [TOOL CALL] tool_name({args})
                payload = line[len("[TOOL CALL]"):].strip()
                tool_calls.append(("call", payload))
            elif line.startswith("[TOOL RESULT]"):
                # Format: [TOOL RESULT] tool_name -> result text
                payload = line[len("[TOOL RESULT]"):].strip()
                tool_calls.append(("result", payload))
            elif line.startswith("[DEBUG] Token usage:"):
                token_line = line[len("[DEBUG] Token usage:"):].strip()

        # Print tool call sequence
        for kind, payload in tool_calls:
            if kind == "call":
                print(f"  -> calling {payload}")
            elif kind == "result":
                # Truncate result to ~150 chars
                display = payload if len(payload) <= 150 else payload[:147] + "..."
                print(f"  <- result: {display}")

        # Print agent reply
        print(f"Agent: {reply}")

        # Print compact token usage if available
        if token_line:
            print(f"[tokens: {token_line}]")
        print()

        history.append({"role": "user", "content": user_input})
        history.append({"role": "assistant", "content": reply})


if __name__ == "__main__":
    main()
