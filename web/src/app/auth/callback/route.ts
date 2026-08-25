import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Exchange auth code for a session (OAuth or email confirmation link).
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      const url = new URL(origin);
      url.pathname = "/login";
      url.searchParams.set("error", error.message);
      return NextResponse.redirect(url);
    }
  }

  // User should now be authenticated.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = new URL(origin);
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Check if a tenants row exists.
  const { data: tenant } = await supabase
    .from("tenants")
    .select("id, business_type")
    .eq("id", user.id)
    .maybeSingle();

  let redirectUrl: URL;

  if (!tenant) {
    // First time — create a minimal tenant row and go to onboarding.
    const { error: insertErr } = await supabase.from("tenants").insert({
      id: user.id,
    });
    if (insertErr) {
      console.error("Failed to create tenant in callback:", insertErr);
    }
    redirectUrl = new URL("/onboarding", origin);
  } else if (!tenant.business_type) {
    // Tenant exists but hasn't completed onboarding.
    redirectUrl = new URL("/onboarding", origin);
  } else {
    // Fully onboarded.
    redirectUrl = new URL("/overview", origin);
  }

  // Build the final redirect, forwarding cookies set during this request.
  const finalResponse = NextResponse.redirect(redirectUrl);
  supabaseResponse.cookies.getAll().forEach((c) =>
    finalResponse.cookies.set(c.name, c.value, c),
  );
  return finalResponse;
}
