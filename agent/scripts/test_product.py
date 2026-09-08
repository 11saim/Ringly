"""Test Product-type tenant order placement end-to-end."""
import sys
import uuid
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.path.insert(0, ".")

from app.supabase_client import get_client
from app.agent.graph import run_agent

sb = get_client()
tenant_id = "b14060b1-d89c-4455-99a3-0be2e1f0cdac"  # Turbo (product)
contact_id = "d6c3d0bd-e727-45bd-b418-ee6dcf64912a"
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

# Step 1: Ask about products
chat("What iPhones do you have?")

# Step 2: Request order
chat("I want to buy 2 of the iPhone 15 128GB - PTA Approved")

# Step 3: Confirm
chat("yes, confirm the order")

# Check DB for orders
orders = (
    sb.table("orders")
    .select("id, status, total_amount, contact_id")
    .eq("tenant_id", tenant_id)
    .eq("contact_id", contact_id)
    .execute()
)
print(f"=== DB orders: {orders.data} ===\n")

if orders.data:
    oid = orders.data[0]["id"]
    items = (
        sb.table("order_items")
        .select("product_id, quantity, unit_price")
        .eq("order_id", oid)
        .execute()
    )
    print(f"=== Order items: {items.data} ===\n")

print("=== ORDER PLACEMENT TEST DONE ===")
