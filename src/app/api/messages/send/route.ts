import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const GRAPH_API_URL = "https://graph.facebook.com/v18.0";

export async function POST(request: NextRequest) {
  // ── 1. Verify session ──
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {},
      },
    },
  );

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "Not authenticated." },
      { status: 401 },
    );
  }

  // ── 2. Parse body ──
  const { conversationId, text } = await request.json();

  if (!conversationId || !text || typeof text !== "string") {
    return NextResponse.json(
      { error: "conversationId and text are required." },
      { status: 400 },
    );
  }

  // ── 3. Look up conversation → tenant_id ──
  const { data: conversation, error: convError } = await supabase
    .from("conversations")
    .select("id, tenant_id, contact_id")
    .eq("id", conversationId)
    .single();

  if (convError || !conversation) {
    console.error(
      "[Messages send] Conversation lookup failed:",
      convError?.message ?? "not found",
    );
    return NextResponse.json(
      { error: "Conversation not found." },
      { status: 404 },
    );
  }

  const tenantId = conversation.tenant_id;

  // ── 4. Look up whatsapp_connections for this tenant ──
  const { data: waConnection, error: waError } = await supabase
    .from("whatsapp_connections")
    .select("phone_number_id, access_token, phone_number")
    .eq("tenant_id", tenantId)
    .eq("status", "connected")
    .single();

  if (waError || !waConnection) {
    console.error(
      "[Messages send] WhatsApp connection not found for tenant:",
      tenantId,
      waError?.message ?? "no connected row",
    );
    return NextResponse.json(
      { error: "WhatsApp not connected for this account." },
      { status: 400 },
    );
  }

  if (!waConnection.phone_number_id || !waConnection.access_token) {
    console.error(
      "[Messages send] WhatsApp connection missing phone_number_id or access_token for tenant:",
      tenantId,
    );
    return NextResponse.json(
      { error: "WhatsApp connection is incomplete." },
      { status: 400 },
    );
  }

  // ── 5. Look up contact phone number ──
  const { data: contact, error: contactError } = await supabase
    .from("contacts")
    .select("phone")
    .eq("id", conversation.contact_id)
    .eq("tenant_id", tenantId)
    .single();

  if (contactError || !contact) {
    console.error(
      "[Messages send] Contact lookup failed for conversation:",
      conversationId,
      contactError?.message ?? "not found",
    );
    return NextResponse.json(
      { error: "Contact not found." },
      { status: 404 },
    );
  }

  // ── 6. Insert message into DB ──
  const { data: message, error: msgError } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_type: "human_staff",
      content: text,
      is_internal_note: false,
    })
    .select("id")
    .single();

  if (msgError || !message) {
    console.error(
      "[Messages send] Message insert failed:",
      msgError?.message ?? "no data returned",
    );
    return NextResponse.json(
      { error: "Failed to save message." },
      { status: 500 },
    );
  }

  // ── 7. Send via WhatsApp Cloud API ──
  const url = `${GRAPH_API_URL}/${waConnection.phone_number_id}/messages`;

  console.log(
    "[Messages send] Sending to",
    contact.phone,
    "via phone_number_id",
    waConnection.phone_number_id,
    "for tenant",
    tenantId,
  );

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${waConnection.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: contact.phone,
        type: "text",
        text: { body: text },
      }),
    });
  } catch (err) {
    console.error("[Messages send] Network error calling Meta API:", err);
    // Message is saved in DB; WhatsApp send failed
    return NextResponse.json({
      ok: true,
      messageId: message.id,
      warning: "Message saved but WhatsApp delivery failed (network error).",
    });
  }

  const metaBody = await res.json();

  if (!res.ok) {
    console.error(
      "[Messages send] Meta API error:",
      JSON.stringify({ status: res.status, body: metaBody }, null, 2),
    );
    return NextResponse.json({
      ok: true,
      messageId: message.id,
      warning:
        metaBody?.error?.message ??
        `Meta API HTTP ${res.status}`,
    });
  }

  console.log(
    "[Messages send] Success:",
    JSON.stringify({ messageId: message.id, meta: metaBody.messages }, null, 2),
  );

  return NextResponse.json({ ok: true, messageId: message.id });
}
