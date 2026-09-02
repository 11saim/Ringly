"""Interactive REPL to test the agent with tool-calling support.

Usage: python scripts/test_agent.py <tenant_id> <contact_id>

A fresh conversation is created in the database for each run, linking
the given contact. The system prompt, contact_id lookup, and service
catalog are all handled automatically.
"""

import sys
import uuid

sys.path.insert(0, ".")

from app.supabase_client import get_client
from app.agent.graph import run_agent


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

    print(f"\ntenant_id       = {tenant_id}")
    print(f"contact_id      = {contact_id}")
    print(f"conversation_id = {conversation_id}\n")

    history: list[dict] = []
    print("Agent REPL ready. Type your message and press Enter.")
    print("Type 'quit' or 'exit' to stop.\n")

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

        reply = run_agent(history, user_input, tenant_id, conversation_id)
        print(f"Agent: {reply}\n")

        history.append({"role": "user", "content": user_input})
        history.append({"role": "assistant", "content": reply})


if __name__ == "__main__":
    main()
