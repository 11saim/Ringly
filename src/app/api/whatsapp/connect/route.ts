import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
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

  const { data: tenant } = await supabase
    .from("tenants")
    .select("id")
    .single();

  if (!tenant) {
    return NextResponse.json(
      { error: "No tenant found." },
      { status: 400 },
    );
  }

  const body = await request.json();
  const { phone_number, phone_number_id, meta_account_id, access_token } =
    body;

  if (!phone_number || !phone_number_id || !meta_account_id || !access_token) {
    return NextResponse.json(
      { error: "All four fields are required." },
      { status: 400 },
    );
  }

  const { error } = await supabase.from("whatsapp_connections").upsert(
    {
      tenant_id: tenant.id,
      phone_number,
      phone_number_id,
      meta_account_id,
      access_token,
      status: "connected",
      connected_at: new Date().toISOString(),
    },
    { onConflict: "tenant_id" },
  );

  if (error) {
    console.error("Failed to save WhatsApp connection:", error);
    return NextResponse.json(
      { error: "Failed to save connection." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
