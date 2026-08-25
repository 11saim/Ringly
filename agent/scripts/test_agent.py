"""Interactive REPL to test an agent's persona and tone.

Usage: python scripts/test_agent.py <tenant_id>
"""

import sys

sys.path.insert(0, ".")

from app.agent.persona import build_system_prompt
from app.agent.graph import run_agent


def main():
    if len(sys.argv) != 2:
        print("Usage: python scripts/test_agent.py <tenant_id>")
        sys.exit(1)

    tenant_id = sys.argv[1]

    print(f"Building system prompt for tenant {tenant_id} ...")
    system_prompt = build_system_prompt(tenant_id)
    print("--- System prompt ---")
    print(system_prompt)
    print("---------------------\n")

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

        reply = run_agent(system_prompt, history, user_input)
        print(f"Agent: {reply}\n")

        history.append({"role": "user", "content": user_input})
        history.append({"role": "assistant", "content": reply})


if __name__ == "__main__":
    main()
