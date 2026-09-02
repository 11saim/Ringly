from langchain_core.tools import tool
from datetime import datetime, timedelta

from app.supabase_client import get_client


@tool
def get_services(tenant_id: str) -> str:
    """Get all active services or products offered by this business.

    Use this tool whenever the customer asks what services or products are
    offered, wants to see the menu/catalog, or asks about pricing. Always
    use the real data returned by this tool — never invent services or
    products. The service_id or product_id values returned here are the
    real UUIDs you must pass to other tools.

    SAFETY: This tool is read-only. It only executes SELECT queries and
    has no code path that inserts, updates, or deletes any data.
    """
    client = get_client()

    # READ-ONLY: .select() queries only — no writes possible by construction.
    tenant = (
        client.table("tenants")
        .select("business_type")
        .eq("id", tenant_id)
        .single()
        .execute()
    )
    business_type = tenant.data.get("business_type", "service")

    if business_type == "service":
        result = (
            client.table("services")
            .select("id, name, description, duration_minutes, price")
            .eq("tenant_id", tenant_id)
            .eq("is_active", True)
            .execute()
        )
        if not result.data:
            return "No services currently offered."
        lines = ["Services offered:"]
        for s in result.data:
            desc = s.get("description") or "No description"
            lines.append(
                f"- {s['name']} (ID: {s['id']}): {desc}, "
                f"{s['duration_minutes']} min, ${s['price']}"
            )
        return "\n".join(lines)
    else:
        result = (
            client.table("products")
            .select("id, name, description, price, stock_quantity, category")
            .eq("tenant_id", tenant_id)
            .eq("is_active", True)
            .execute()
        )
        if not result.data:
            return "No products currently offered."
        lines = ["Products offered:"]
        for p in result.data:
            desc = p.get("description") or "No description"
            cat = p.get("category") or "N/A"
            lines.append(
                f"- {p['name']} (ID: {p['id']}): {desc}, "
                f"${p['price']}, {p['stock_quantity']} in stock, Category: {cat}"
            )
        return "\n".join(lines)


@tool
def check_availability(
    tenant_id: str,
    service_id: str,
    scheduled_at: str,
    duration_minutes: int,
) -> str:
    """Check whether a time slot is available for booking.

    Use this when the customer asks if a specific date and time is open,
    or wants to know availability before committing to a booking.
    Returns "Available" or explains which existing booking causes a conflict.
    """
    client = get_client()

    start = datetime.fromisoformat(scheduled_at)
    end = start + timedelta(minutes=duration_minutes)

    result = (
        client.table("bookings")
        .select("scheduled_at, duration_minutes")
        .eq("tenant_id", tenant_id)
        .eq("service_id", service_id)
        .eq("status", "upcoming")
        .execute()
    )

    for booking in result.data:
        b_start = datetime.fromisoformat(booking["scheduled_at"])
        b_end = b_start + timedelta(minutes=booking["duration_minutes"])

        if b_start < end and b_end > start:
            return (
                f"Not available — already booked at {b_start.strftime('%Y-%m-%d %H:%M')}. "
                f"Please suggest another time."
            )

    return "Available"


@tool
def create_booking(
    tenant_id: str,
    service_id: str,
    scheduled_at: str,
    duration_minutes: int,
) -> str:
    """Book an appointment for the customer.

    Use this when the customer wants to confirm a booking and you have all
    required details: service (a real UUID from get_services), date/time,
    and duration.
    """
    client = get_client()
    try:
        result = client.rpc(
            "agent_create_booking",
            {
                "p_tenant_id": tenant_id,
                "p_service_id": service_id,
                "p_scheduled_at": scheduled_at,
                "p_duration_minutes": duration_minutes,
            },
        ).execute()
        booking = result.data
        return (
            f"Booking confirmed! "
            f"Service: {service_id}, "
            f"Date: {scheduled_at}, Duration: {duration_minutes} minutes. "
            f"Booking ID: {booking.get('id', 'N/A')}."
        )
    except Exception as exc:
        error_msg = str(exc).lower()
        if "already booked" in error_msg or "conflict" in error_msg:
            return (
                "That time slot is already booked. "
                "Please suggest another time to the customer."
            )
        return (
            f"TECHNICAL_ERROR: {exc}. "
            "A system error occurred. Apologize to the customer, "
            "let them know you're having trouble completing this right now, "
            "and offer to have someone follow up."
        )


@tool
def create_order(tenant_id: str, items: list) -> str:
    """Place an order for the customer.

    Use this when the customer wants to buy products and you have the list
    of items (each with a real product_id from get_services and a quantity).
    """
    client = get_client()
    try:
        result = client.rpc(
            "agent_create_order",
            {
                "p_tenant_id": tenant_id,
                "p_items": items,
            },
        ).execute()
        order = result.data
        return (
            f"Order placed successfully! "
            f"Order ID: {order.get('id', 'N/A')}, "
            f"Status: {order.get('status', 'pending')}."
        )
    except Exception as exc:
        error_msg = str(exc).lower()
        if "out of stock" in error_msg or "insufficient" in error_msg:
            return (
                "One or more items are out of stock or have insufficient quantity. "
                "Let the customer know and suggest alternatives."
            )
        return (
            f"TECHNICAL_ERROR: {exc}. "
            "A system error occurred. Apologize to the customer, "
            "let them know you're having trouble completing this right now, "
            "and offer to have someone follow up."
        )


@tool
def escalate(tenant_id: str, conversation_id: str, reason: str) -> str:
    """Hand this conversation off to a human agent.

    Use this when the customer explicitly asks to speak to a human, or when
    the situation requires human intervention (e.g. complaint, refund request,
    or repeated technical errors).
    """
    client = get_client()
    client.table("conversations").update(
        {
            "status": "human",
            "handed_off_at": datetime.now().isoformat(),
            "handoff_trigger": reason,
        }
    ).eq("id", conversation_id).eq("tenant_id", tenant_id).execute()

    return (
        "I've connected you with a human team member. "
        "They'll pick this up shortly. Thank you for your patience!"
    )
