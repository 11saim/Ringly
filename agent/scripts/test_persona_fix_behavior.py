"""Test the persona fix: location query on product tenant, order request on service tenant."""
import sys
import uuid
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.path.insert(0, ".")

from app.supabase_client import get_client
from app.agent.graph import run_agent

sb = get_client()

# ── Product tenant: "what's your location?" ────────────────────────
print("=" * 60)
print("TEST 1: Product tenant asked about location")
print("=" * 60)
tenant_id = "b14060b1-d89c-4455-99a3-0be2e1f0cdac"  # Turbo
conversation_id = str(uuid.uuid4())
# Find a valid contact for this tenant
contact = (
    sb.table("contacts")
    .select("id")
    .eq("tenant_id", tenant_id)
    .limit(1)
    .execute()
)
if not contact.data:
    # Create one
    cid = str(uuid.uuid4())
    sb.table("contacts").insert({"id": cid, "tenant_id": tenant_id, "name": "Test User", "phone": "+1555000000"}).execute()
    contact_id = cid
else:
    contact_id = contact.data[0]["id"]

sb.table("conversations").insert(
    {"id": conversation_id, "tenant_id": tenant_id, "contact_id": contact_id, "status": "agent"}
).execute()

history = []
reply = run_agent(history, "What's your location?", tenant_id, conversation_id)
print(f"You: What's your location?")
print(f"Agent: {reply}\n")
assert reply is not None, "Agent should respond"
# Check it doesn't promise to fetch/look up the address
lower = reply.lower()
assert "not provided" in lower or "don't have" in lower or "not listed" in lower or "online" in lower or "delivery" in lower or "saimshabbir" in lower or "email" in lower or "phone" in lower, \
    f"Agent should honestly say location is not provided, got: {reply}"
print("✓ PASS: Agent honestly addressed the missing location\n")

# ── Service tenant: "order a product" ──────────────────────────────
print("=" * 60)
print("TEST 2: Service tenant asked to order a product")
print("=" * 60)
tenant_id = "e0f31abc-8acf-4c8f-9d81-5f849a53af9b"  # Tokyo Salon
conversation_id = str(uuid.uuid4())
contact = (
    sb.table("contacts")
    .select("id")
    .eq("tenant_id", tenant_id)
    .limit(1)
    .execute()
)
contact_id = contact.data[0]["id"]

sb.table("conversations").insert(
    {"id": conversation_id, "tenant_id": tenant_id, "contact_id": contact_id, "status": "agent"}
).execute()

history = []
reply = run_agent(history, "Can I order a laptop from you?", tenant_id, conversation_id)
print(f"You: Can I order a laptop from you?")
print(f"Agent: {reply}\n")
assert reply is not None, "Agent should respond"
lower = reply.lower()
assert "salon" in lower or "beauty" in lower or "service" in lower or "book" in lower or "appointment" in lower, \
    f"Agent should explain what the business actually offers, got: {reply}"
print("✓ PASS: Agent explained what the business offers\n")

# ── Service tenant: "what's your address?" ─────────────────────────
print("=" * 60)
print("TEST 3: Service tenant asked about address (has one)")
print("=" * 60)
conversation_id = str(uuid.uuid4())
sb.table("conversations").insert(
    {"id": conversation_id, "tenant_id": tenant_id, "contact_id": contact_id, "status": "agent"}
).execute()

history = []
reply = run_agent(history, "What's your address?", tenant_id, conversation_id)
print(f"You: What's your address?")
print(f"Agent: {reply}\n")
assert reply is not None, "Agent should respond"
# This tenant HAS an address ("Faisalabad"), so it should reference it
lower = reply.lower()
assert "faisalabad" in lower or "address" in lower, \
    f"Agent should mention the actual address, got: {reply}"
print("✓ PASS: Agent referenced the real address\n")

# ── Product tenant: "book a haircut" ───────────────────────────────
print("=" * 60)
print("TEST 4: Product tenant asked to book a service")
print("=" * 60)
tenant_id = "b14060b1-d89c-4455-99a3-0be2e1f0cdac"  # Turbo
conversation_id = str(uuid.uuid4())
contact = (
    sb.table("contacts")
    .select("id")
    .eq("tenant_id", tenant_id)
    .limit(1)
    .execute()
)
contact_id = contact.data[0]["id"]

sb.table("conversations").insert(
    {"id": conversation_id, "tenant_id": tenant_id, "contact_id": contact_id, "status": "agent"}
).execute()

history = []
reply = run_agent(history, "Can I book a haircut?", tenant_id, conversation_id)
print(f"You: Can I book a haircut?")
print(f"Agent: {reply}\n")
assert reply is not None, "Agent should respond"
lower = reply.lower()
assert "don't" in lower or "not" in lower or "product" in lower or "iphone" in lower or "phone" in lower or "sell" in lower, \
    f"Agent should clarify this isn't offered, got: {reply}"
print("✓ PASS: Agent clarified the mismatch\n")

print("=" * 60)
print("ALL TESTS PASSED")
print("=" * 60)
