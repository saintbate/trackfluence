import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerClient();

  const { data: auth, error: userErr } = await supabase.auth.getUser();
  if (!auth?.user?.email) {
    return NextResponse.json(
      { ok: false, user: auth, userErr, brands: [], brandErr: userErr ?? null },
      { status: 401 }
    );
  }

  const { id: ownerId, email: ownerEmail } = auth.user;

  const { data: brands, error: brandErr } = await supabase
    .from("brand")
    .select("*")
    .or(`owner_user_id.eq.${ownerId},owner_user_email.eq.${ownerEmail}`)
    .order("created_at", { ascending: true });

  if (brandErr) {
    return NextResponse.json(
      { ok: false, user: auth, userErr, brands: [], brandErr },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, user: auth, userErr, brands, brandErr: null });
}