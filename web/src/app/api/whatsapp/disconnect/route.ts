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

  const { error } = await supabase
    .from("whatsapp_connections")
    .update({ status: "disconnected" })
    .eq("tenant_id", tenant.id);

  if (error) {
    console.error("Failed to disconnect WhatsApp:", error);
    return NextResponse.json(
      { error: "Failed to disconnect." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
