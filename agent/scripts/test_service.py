"""Test Service-type tenant (Tokyo Salon): declines to sell/order."""
import sys
import uuid
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.path.insert(0, ".")

from app.supabase_client import get_client
from app.agent.graph import run_agent

sb = get_client()
tenant_id = "e0f31abc-8acf-4c8f-9d81-5f849a53af9b"  # Tokyo Salon (service)
contact_id = "845a7ba0-7e2f-4eb8-ab0c-8169d6406317"
conversation_id = str(uuid.uuid4())

sb.table("conversations").insert(
    {"id": conversation_id, "tenant_id": tenant_id, "contact_id": contact_id, "status": "agent"}
).execute()

history = []

def chat(msg):
    global history
    print(f"You: {msg}")
    reply = run_agent(history, msg, tenant_id, conversation_id)
    print(f"Agent: {reply}\n")
    history.append({"role": "user", "content": msg})
    history.append({"role": "assistant", "content": reply})
    return reply

# Test 1: Ask to buy/order something — should decline
chat("I want to buy 2 iPhones")

# Test 2: Ask to order a product — should decline
chat("Can I place an order for a laptop?")

print("=== SERVICE TENANT TEST DONE ===")
