import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function DELETE(request: NextRequest) {
  // ── 1. Verify the caller has a valid session ──
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // No-op — we don't set cookies in this route.
        },
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

  // ── 2. Call the SECURITY DEFINER function ──
  // The function runs as the DB owner so it bypasses RLS and grant
  // restrictions. It deletes the tenant row (cascading to all child
  // tables) and then the auth user.
  const { error } = await supabase.rpc("delete_user_account", {
    target_user_id: user.id,
  });

  if (error) {
    console.error("Failed to delete account:", error);
    return NextResponse.json(
      { error: `Deletion failed: ${error.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
