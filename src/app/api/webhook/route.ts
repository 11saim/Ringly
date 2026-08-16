import { NextResponse, type NextRequest } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get("hub.mode");
  const token = request.nextUrl.searchParams.get("hub.verify_token");
  const challenge = request.nextUrl.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const phoneNumberId =
    body?.entry?.[0]?.changes?.[0]?.value?.metadata?.phone_number_id;
  const messages: Array<{
    from: string;
    id: string;
    timestamp: string;
    type: string;
    text?: { body: string };
  }> = body?.entry?.[0]?.changes?.[0]?.value?.messages ?? [];
  const contacts: Array<{
    wa_id: string;
    profile?: { name?: string };
  }> = body?.entry?.[0]?.changes?.[0]?.value?.contacts ?? [];

  if (!phoneNumberId || messages.length === 0) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const supabase = createServiceRoleClient();

  // ── 1. Resolve tenant from whatsapp_connections ──
  const {
    data: connection,
    error: connectionError,
  } = await supabase
    .from("whatsapp_connections")
    .select("tenant_id")
    .eq("phone_number_id", phoneNumberId)
    .eq("status", "connected")
    .single();

  if (connectionError) {
    console.error(
      "[WhatsApp webhook] Step 1 FAILED — whatsapp_connections lookup:",
      connectionError.message,
      connectionError,
    );
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (!connection?.tenant_id) {
    console.warn(
      "[WhatsApp webhook] No connected tenant for phone_number_id:",
      phoneNumberId,
    );
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const tenantId = connection.tenant_id;

  // ── 2. Process each message ──
  for (const msg of messages) {
    const contactProfile = contacts.find((c) => c.wa_id === msg.from);
    const contactName = contactProfile?.profile?.name ?? null;

    // ── 2a. Find or create contact (scoped to this tenant) ──
    const {
      data: existingContact,
      error: contactFindError,
    } = await supabase
      .from("contacts")
      .select("id")
      .eq("tenant_id", tenantId)
      .eq("phone", msg.from)
      .single();

    // PGRST116 = "No rows found" — expected when contact doesn't exist yet
    if (contactFindError && contactFindError.code !== "PGRST116") {
      console.error(
        "[WhatsApp webhook] Step 2a FAILED — contact find:",
        contactFindError.message,
        contactFindError,
      );
      continue;
    }

    let contactId: string;

    if (existingContact) {
      contactId = existingContact.id;
      const { error: contactUpdateError } = await supabase
        .from("contacts")
        .update({
          last_contact_at: new Date().toISOString(),
          ...(contactName ? { name: contactName } : {}),
        })
        .eq("id", contactId)
        .eq("tenant_id", tenantId);

      if (contactUpdateError) {
        console.error(
          "[WhatsApp webhook] Step 2a FAILED — contact update:",
          contactUpdateError.message,
          contactUpdateError,
        );
      }
    } else {
      const {
        data: newContact,
        error: contactInsertError,
      } = await supabase
        .from("contacts")
        .insert({
          tenant_id: tenantId,
          phone: msg.from,
          name: contactName,
        })
        .select("id")
        .single();

      if (contactInsertError || !newContact) {
        console.error(
          "[WhatsApp webhook] Step 2a FAILED — contact insert:",
          contactInsertError?.message ?? "no data returned",
          contactInsertError,
        );
        continue;
      }

      contactId = newContact.id;
    }

    // ── 2b. Find or create active conversation (scoped to this tenant) ──
    const {
      data: existingConversation,
      error: convFindError,
    } = await supabase
      .from("conversations")
      .select("id")
      .eq("tenant_id", tenantId)
      .eq("contact_id", contactId)
      .neq("status", "resolved")
      .order("last_message_at", { ascending: false })
      .limit(1)
      .single();

    if (convFindError && convFindError.code !== "PGRST116") {
      console.error(
        "[WhatsApp webhook] Step 2b FAILED — conversation find:",
        convFindError.message,
        convFindError,
      );
      continue;
    }

    let conversationId: string;

    if (existingConversation) {
      conversationId = existingConversation.id;
      const { error: convUpdateError } = await supabase
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversationId)
        .eq("tenant_id", tenantId);

      if (convUpdateError) {
        console.error(
          "[WhatsApp webhook] Step 2b FAILED — conversation update:",
          convUpdateError.message,
          convUpdateError,
        );
      }
    } else {
      const {
        data: newConversation,
        error: convInsertError,
      } = await supabase
        .from("conversations")
        .insert({
          tenant_id: tenantId,
          contact_id: contactId,
          status: "agent",
        })
        .select("id")
        .single();

      if (convInsertError || !newConversation) {
        console.error(
          "[WhatsApp webhook] Step 2b FAILED — conversation insert:",
          convInsertError?.message ?? "no data returned",
          { convInsertError, tenantId, contactId },
        );
        continue;
      }

      conversationId = newConversation.id;
    }

    // ── 2c. Insert message ──
    const content =
      msg.type === "text" ? msg.text?.body ?? "" : `[${msg.type}]`;

    const { error: msgInsertError } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_type: "customer",
        content,
      });

    if (msgInsertError) {
      console.error(
        "[WhatsApp webhook] Step 2c FAILED — message insert:",
        msgInsertError.message,
        msgInsertError,
      );
    }
  }

  console.log(
    "[WhatsApp webhook] Processed",
    messages.length,
    "message(s) for tenant",
    tenantId,
  );

  return NextResponse.json({ ok: true }, { status: 200 });
}
