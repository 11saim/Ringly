"""End-to-end test: book, confirm, reschedule, cancel."""
import sys
import uuid
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.path.insert(0, ".")

from app.supabase_client import get_client
from app.agent.graph import run_agent

sb = get_client()
tenant_id = "e0f31abc-8acf-4c8f-9d81-5f849a53af9b"
contact_id = "845a7ba0-7e2f-4eb8-ab0c-8169d6406317"
conversation_id = str(uuid.uuid4())

sb.table("conversations").insert(
    {
        "id": conversation_id,
        "tenant_id": tenant_id,
        "contact_id": contact_id,
        "status": "agent",
    }
).execute()

history = []
reply = ""

def chat(msg):
    global reply, history
    print(f"You: {msg}")
    reply = run_agent(history, msg, tenant_id, conversation_id)
    print(f"Agent: {reply}\n")
    history.append({"role": "user", "content": msg})
    history.append({"role": "assistant", "content": reply})
    return reply

# Step 1: Ask to book
chat("I want a Haircut & Styling tomorrow at 2pm")

# Step 2: Confirm booking
chat("yes, confirm it")

# Check what bookings exist now
bookings = (
    sb.table("bookings")
    .select("id, service_id, scheduled_at, status")
    .eq("tenant_id", tenant_id)
    .eq("contact_id", contact_id)
    .eq("status", "upcoming")
    .execute()
)
print(f"=== DB bookings after create: {bookings.data} ===\n")

if bookings.data:
    bid = bookings.data[0]["id"]
    print(f"=== booking_id = {bid} ===\n")

    # Step 3: Try off-grid time
    chat("Can you reschedule it to 3:23pm?")

    # Step 4: Reschedule to valid time
    chat(f"OK reschedule it to 4:30pm instead. My booking ID is {bid}")

    # Check DB after reschedule
    after = (
        sb.table("bookings")
        .select("id, scheduled_at, status")
        .eq("id", bid)
        .single()
        .execute()
    )
    print(f"=== DB after reschedule: {after.data} ===\n")

    # Step 5: Cancel
    chat(f"Cancel my booking {bid}")

    # Check DB after cancel
    after_cancel = (
        sb.table("bookings")
        .select("id, status")
        .eq("id", bid)
        .single()
        .execute()
    )
    print(f"=== DB after cancel: {after_cancel.data} ===\n")
else:
    print("No booking was created — test failed!")

print("=== DONE ===")
