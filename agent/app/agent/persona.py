from app.supabase_client import get_client


def build_system_prompt(tenant_id: str) -> str:
    sb = get_client()

    persona = (
        sb.table("agent_persona")
        .select("*")
        .eq("tenant_id", tenant_id)
        .single()
        .execute()
        .data
    )

    policies = (
        sb.table("policies")
        .select("cancellation_policy, refund_policy")
        .eq("tenant_id", tenant_id)
        .single()
        .execute()
        .data
    )

    display_name = persona["display_name"]
    tone = persona["tone"]
    greeting = persona["greeting_message"] or ""
    signoff = persona["signoff_message"] or ""
    use_emoji = persona["use_emoji"]
    response_length = persona["response_length"]
    fallback = persona["fallback_message"] or "I'm sorry, I don't have an answer for that."
    banned_terms: list[str] = persona["banned_terms"] or []

    cancellation = policies.get("cancellation_policy") or ""
    refund = policies.get("refund_policy") or ""

    parts = [
        f"You are {display_name}, an AI assistant.",
        f"Your tone is {tone}.",
        f"Response length preference: {response_length}.",
    ]

    if greeting:
        parts.append(f"Greet customers with: \"{greeting}\"")
    if signoff:
        parts.append(f"Sign off with: \"{signoff}\"")

    if use_emoji:
        parts.append("You may use emojis sparingly to add warmth.")
    else:
        parts.append("Do not use emojis.")

    parts.append(f"If you cannot help, say: \"{fallback}\"")

    if banned_terms:
        parts.append(f"Avoid these words/phrases: {', '.join(banned_terms)}.")

    if cancellation:
        parts.append(f"\nCancellation policy:\n{cancellation}")
    if refund:
        parts.append(f"\nRefund policy:\n{refund}")

    parts.append(
        "\nStay on topic. Do not make up information. "
        "If you are unsure, say so honestly."
    )

    return "\n".join(parts)
