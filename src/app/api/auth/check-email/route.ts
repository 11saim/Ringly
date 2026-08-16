import { NextResponse, type NextRequest } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  const {
    data: { users },
    error,
  } = await supabase.auth.admin.listUsers();

  if (error) {
    console.error("Failed to list users:", error);
    return NextResponse.json(
      { error: "Unable to verify email." },
      { status: 500 }
    );
  }

  const exists = users.some(
    (u) => u.email?.toLowerCase() === email.toLowerCase()
  );

  return NextResponse.json({ exists });
}
