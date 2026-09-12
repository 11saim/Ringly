from langchain_core.tools import tool
from datetime import datetime, timedelta, timezone
import logging
import re

from app.supabase_client import get_client
from app.kb.embed import embed_text

log = logging.getLogger(__name__)

_VALID_MINUTES = {0, 15, 30, 45}


def _validate_slot_grid(scheduled_at: str) -> str | None:
    """Return None if on a 15-minute boundary, or an error message."""
    try:
        dt = datetime.fromisoformat(scheduled_at)
    except (ValueError, TypeError):
        return None  # let the caller's own timestamp validation handle it
    if dt.minute not in _VALID_MINUTES:
        return (
            "Bookings must start on the hour or at :15, :30, or :45 — "
            "please suggest the nearest valid time."
        )
    return None

_UUID_RE = re.compile(
    r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
    re.IGNORECASE,
)


def _validate_uuid(value: str, label: str, retry: bool = False) -> str | None:
    """Return None if valid, or an error message string if not.

    If retry=True, the message tells the model to fix and retry rather
    than restart the confirmation flow.
    """
    if not value or not _UUID_RE.match(value):
        if retry:
            return (
                f"Invalid {label} (technical error — not your fault). "
                "Do NOT ask the customer to reconfirm. Simply fix the "
                f"{label} using a real value from get_services and retry "
                "the same booking call."
            )
        return (
            f"Invalid {label} — ask the customer to choose from the list again."
        )
    return None


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
    Returns "Available" or explains why the slot is not available
    (outside business hours, holiday closure, or existing booking conflict).
    """
    err = _validate_uuid(service_id, "service selection")
    if err:
        return err

    slot_err = _validate_slot_grid(scheduled_at)
    if slot_err:
        return slot_err

    client = get_client()
    start = datetime.fromisoformat(scheduled_at).replace(tzinfo=timezone.utc)
    end = start + timedelta(minutes=duration_minutes)
    day_of_week = start.weekday()  # 0=Monday .. 6=Sunday
    date_str = start.date().isoformat()

    # ── 1. Check business hours for this day of week ───────────────
    hours_row = (
        client.table("business_hours")
        .select("is_closed, open_time, close_time")
        .eq("tenant_id", tenant_id)
        .eq("day_of_week", day_of_week)
        .single()
        .execute()
        .data
    )

    if not hours_row or hours_row.get("is_closed"):
        return (
            "Not available — the business is closed on this day. "
            "Please suggest another date."
        )

    open_time_str = hours_row.get("open_time", "")
    close_time_str = hours_row.get("close_time", "")

    # Parse open/close times — Postgres returns "HH:MM:SS" for time columns,
    # so take only the first two parts ("HH:MM") regardless.
    open_h, open_m = map(int, open_time_str.split(":")[:2])
    close_h, close_m = map(int, close_time_str.split(":")[:2])
    req_time = start.time()

    from datetime import time as _time
    open_t = _time(open_h, open_m)
    close_t = _time(close_h, close_m)

    if req_time < open_t or req_time >= close_t:
        return (
            f"Not available — outside business hours "
            f"({open_time_str}–{close_time_str}). "
            f"Please suggest a time within business hours."
        )

    # ── 2. Check business_hour_exceptions for this specific date ───
    exc_result = (
        client.table("business_hour_exceptions")
        .select("is_closed, label")
        .eq("tenant_id", tenant_id)
        .eq("exception_date", date_str)
        .execute()
    )
    exception = exc_result.data[0] if exc_result.data else None

    if exception and exception.get("is_closed"):
        label = exception.get("label") or ""
        return (
            f"Not available — the business is closed on {date_str}"
            + (f" ({label})" if label else "")
            + ". Please suggest another date."
        )

    # ── 3. Check capacity-aware booking conflicts ──────────────────
    # Fetch service capacity
    svc_result = (
        client.table("services")
        .select("capacity")
        .eq("id", service_id)
        .single()
        .execute()
    )
    capacity = (svc_result.data or {}).get("capacity") or 1

    # Count overlapping bookings for this service
    result = (
        client.table("bookings")
        .select("scheduled_at, duration_minutes")
        .eq("tenant_id", tenant_id)
        .eq("service_id", service_id)
        .eq("status", "upcoming")
        .execute()
    )

    overlap_count = 0
    for booking in result.data:
        b_start = datetime.fromisoformat(booking["scheduled_at"])
        if b_start.tzinfo is None:
            b_start = b_start.replace(tzinfo=timezone.utc)
        b_end = b_start + timedelta(minutes=booking["duration_minutes"])

        if b_start < end and b_end > start:
            overlap_count += 1

    if overlap_count >= capacity:
        return (
            f"Not available — this time slot is fully booked "
            f"({overlap_count}/{capacity} spots taken). "
            f"Please suggest another time."
        )

    return "Available"


@tool
def create_booking(
    tenant_id: str,
    contact_id: str,
    service_id: str,
    scheduled_at: str,
    duration_minutes: int,
) -> str:
    """Book an appointment for the customer.

    Use this when the customer wants to confirm a booking and you have all
    required details: service (a real UUID from get_services), date/time,
    and duration.

    Each booking is for exactly ONE person and ONE service at ONE time.
    There is no way to combine multiple people or multiple services into
    a single booking. If a customer wants multiple people booked, or one
    person booked for multiple services, you must call create_booking
    separately for each person+service combination — e.g. 2 people wanting
    the same service is 2 separate create_booking calls; 1 person wanting
    2 services is also 2 separate calls, at back-to-back or the customer's
    preferred times. Never propose or imply a 'combined' booking that merges
    multiple people or services into one appointment — that doesn't exist
    in this system. When a request is complex (multiple people/services),
    clearly summarize each individual booking you're about to create one by
    one before confirming, so the customer understands exactly what will
    happen.
    """
    err = _validate_uuid(service_id, "service_id", retry=True)
    if err:
        return err
    err = _validate_uuid(contact_id, "contact_id", retry=True)
    if err:
        return err

    # Validate scheduled_at is a real ISO timestamp before hitting the database
    try:
        datetime.fromisoformat(scheduled_at)
    except (ValueError, TypeError):
        return (
            f"TECHNICAL_ERROR: '{scheduled_at}' is not a valid date/time. "
            "Do NOT ask the customer to reconfirm. Fix the date/time using "
            "a real ISO timestamp and retry the same booking call."
        )

    slot_err = _validate_slot_grid(scheduled_at)
    if slot_err:
        return slot_err

    client = get_client()
    try:
        result = client.rpc(
            "agent_create_booking",
            {
                "p_tenant_id": tenant_id,
                "p_contact_id": contact_id,
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
        if "already booked" in error_msg or "conflict" in error_msg or "fully booked" in error_msg:
            return (
                "That time slot is fully booked. "
                "Do NOT ask the customer to reconfirm — simply suggest "
                "another time and retry with corrected data."
            )
        return (
            f"TECHNICAL_ERROR: {exc}. "
            "Do NOT ask the customer to reconfirm. If this is a validation "
            "error, fix the data and retry. Otherwise apologize once and "
            "offer to have someone follow up."
        )


@tool
def create_order(tenant_id: str, contact_id: str, items: list) -> str:
    """Place an order for the customer.

    Use this when the customer wants to buy products and you have the list
    of items (each with a real product_id from get_services and a quantity).
    """
    # Validate items structure before hitting the database
    if not isinstance(items, list) or len(items) == 0:
        return (
            "TECHNICAL_ERROR: No items provided for the order. "
            "Ask the customer what products they'd like to order."
        )
    for i, item in enumerate(items):
        if not isinstance(item, dict):
            return (
                f"TECHNICAL_ERROR: Item {i+1} is not valid. "
                "Each item must be a product with a quantity."
            )
        if not item.get("product_id") or not item.get("quantity"):
            return (
                f"TECHNICAL_ERROR: Item {i+1} is missing product_id or quantity. "
                "Ask the customer which products they want and how many."
            )

    client = get_client()
    try:
        result = client.rpc(
            "agent_create_order",
            {
                "p_tenant_id": tenant_id,
                "p_contact_id": contact_id,
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
def reschedule_booking(
    tenant_id: str,
    contact_id: str,
    booking_id: str,
    new_scheduled_at: str,
) -> str:
    """Reschedule an existing booking to a new date/time.

    Use this when the customer wants to change the time of an existing
    booking. You need the booking_id (returned when create_booking succeeded)
    and the new date/time. The booking must belong to this customer.
    """
    err = _validate_uuid(booking_id, "booking_id", retry=True)
    if err:
        return err

    try:
        datetime.fromisoformat(new_scheduled_at)
    except (ValueError, TypeError):
        return (
            f"TECHNICAL_ERROR: '{new_scheduled_at}' is not a valid date/time. "
            "Fix the date/time and retry."
        )

    slot_err = _validate_slot_grid(new_scheduled_at)
    if slot_err:
        return slot_err

    client = get_client()
    try:
        result = client.rpc(
            "agent_reschedule_booking",
            {
                "p_tenant_id": tenant_id,
                "p_contact_id": contact_id,
                "p_booking_id": booking_id,
                "p_new_scheduled_at": new_scheduled_at,
            },
        ).execute()
        booking = result.data
        return (
            f"Booking rescheduled successfully! "
            f"New time: {booking.get('scheduled_at', new_scheduled_at)}. "
            f"Booking ID: {booking.get('id', 'N/A')}."
        )
    except Exception as exc:
        error_msg = str(exc).lower()
        if "not found" in error_msg:
            return (
                "Booking not found — it may have already been cancelled or "
                "does not belong to this customer. Please check the booking "
                "ID and try again."
            )
        if "fully booked" in error_msg or "conflict" in error_msg:
            return (
                "That time slot is fully booked. "
                "Suggest another time and retry."
            )
        return (
            f"TECHNICAL_ERROR: {exc}. "
            "Apologize to the customer and offer to have someone follow up."
        )


@tool
def cancel_booking(tenant_id: str, contact_id: str, booking_id: str) -> str:
    """Cancel an existing booking.

    Use this when the customer wants to cancel a booking. You need the
    booking_id (returned when create_booking succeeded). The booking must
    belong to this customer.
    """
    err = _validate_uuid(booking_id, "booking_id", retry=True)
    if err:
        return err

    client = get_client()
    try:
        result = client.rpc(
            "agent_cancel_booking",
            {
                "p_tenant_id": tenant_id,
                "p_contact_id": contact_id,
                "p_booking_id": booking_id,
            },
        ).execute()
        booking = result.data
        return (
            f"Booking cancelled successfully. "
            f"Booking ID: {booking.get('id', 'N/A')}."
        )
    except Exception as exc:
        error_msg = str(exc).lower()
        if "not found" in error_msg:
            return (
                "Booking not found — it may have already been cancelled or "
                "does not belong to this customer."
            )
        return (
            f"TECHNICAL_ERROR: {exc}. "
            "Apologize to the customer and offer to have someone follow up."
        )


@tool
def cancel_order(tenant_id: str, contact_id: str, order_id: str) -> str:
    """Cancel an existing order.

    Use this when the customer wants to cancel an order. You need the
    order_id (returned when create_order succeeded). The order must
    belong to this customer.
    """
    err = _validate_uuid(order_id, "order_id", retry=True)
    if err:
        return err

    client = get_client()
    try:
        result = client.rpc(
            "agent_cancel_order",
            {
                "p_tenant_id": tenant_id,
                "p_contact_id": contact_id,
                "p_order_id": order_id,
            },
        ).execute()
        order = result.data
        return (
            f"Order cancelled successfully. "
            f"Order ID: {order.get('id', 'N/A')}."
        )
    except Exception as exc:
        error_msg = str(exc).lower()
        if "not found" in error_msg:
            return (
                "Order not found — it may have already been cancelled or "
                "does not belong to this customer."
            )
        return (
            f"TECHNICAL_ERROR: {exc}. "
            "Apologize to the customer and offer to have someone follow up."
        )


@tool
def escalate(tenant_id: str, conversation_id: str, reason: str) -> str:
    """Hand this conversation off to a human agent.

    Use this when the customer explicitly asks to speak to a human, or when
    the situation requires human intervention (e.g. complaint, refund request,
    or repeated technical errors).

    Args:
        reason: The reason for escalation. Must be exactly one of:
            - "refund_request": Customer is requesting a refund or return.
            - "angry_customer": Customer is upset, frustrated, or complaining.
            - "cant_answer": You don't know the answer or the request is
              outside your capabilities.
            - "asks_for_human": Customer directly asked to speak with a person.
            - "custom": None of the above categories fit. Use as a catch-all.
    """
    VALID_REASONS = {"refund_request", "angry_customer", "cant_answer", "asks_for_human", "custom"}

    if reason not in VALID_REASONS:
        print(f"[ESCALATE] Invalid reason '{reason}', defaulting to 'custom'")
        reason = "custom"

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


@tool
def search_knowledge_base(tenant_id: str, query: str) -> str:
    """Search the business's knowledge base for relevant information.

    Use this tool whenever a customer asks something that might be covered
    by FAQs, uploaded documents, or pasted text content — e.g. specific
    policies, detailed product/service info, operating procedures, or any
    question not already answered by get_services or the business info in
    your system prompt.

    Returns relevant text chunks from the knowledge base, or a message
    if nothing relevant is found. Use the exact information returned —
    do not guess or invent details.
    """
    try:
        query_embedding = embed_text(query)
    except Exception as exc:
        log.warning("Failed to embed query: %s", exc)
        return (
            "No relevant information found in the knowledge base for this query."
        )

    client = get_client()
    try:
        result = client.rpc(
            "match_kb_embeddings",
            {
                "p_tenant_id": tenant_id,
                "p_query_embedding": query_embedding,
                "p_match_count": 5,
            },
        ).execute()
    except Exception as exc:
        log.warning("Failed to search kb_embeddings: %s", exc)
        return (
            "No relevant information found in the knowledge base for this query."
        )

    matches = result.data or []
    good = [m for m in matches if (m.get("similarity") or 0) > 0.5]

    if not good:
        return (
            "No relevant information found in the knowledge base for this query."
        )

    # Best-effort: increment usage_count for matched FAQs
    for m in good:
        faq_id = m.get("source_faq_id")
        if faq_id:
            try:
                row = (
                    client.table("kb_faqs")
                    .select("usage_count")
                    .eq("id", faq_id)
                    .single()
                    .execute()
                    .data
                )
                current = (row or {}).get("usage_count") or 0
                client.table("kb_faqs").update(
                    {"usage_count": current + 1}
                ).eq("id", faq_id).execute()
            except Exception:
                log.debug("Could not increment usage_count for faq %s", faq_id)

    chunks = [m["content"] for m in good]
    return "\n\n---\n\n".join(chunks)
