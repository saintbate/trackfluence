// app/api/debug/brand/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerClient();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ ok: false, user, userErr, brands: [], brandErr: userErr ?? null }, { status: 401 });
  }

  const { data: brands, error: brandErr } = await supabase
    .from("brand")
    .select("*")
    .or(`owner_user_id.eq.${user.id},owner_user_email.eq.${user.email}`)
    .order("created_at", { ascending: true });

  return NextResponse.json({ ok: !brandErr, user, userErr, brands: brands ?? [], brandErr: brandErr ?? null });
}