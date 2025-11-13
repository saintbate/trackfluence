// app/whoami/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerClient();

  const { data: auth, error: userErr } = await supabase.auth.getUser();

  if (!auth?.user?.email) {
    return NextResponse.json({ user: auth, userErr, brands: [], brandErr: userErr ?? null });
  }

  const { id: ownerId, email: ownerEmail } = auth.user;

  const { data: brands, error: brandErr } = await supabase
    .from("brand")
    .select("*")
    .or(`owner_user_id.eq.${ownerId},owner_user_email.eq.${ownerEmail}`)
    .order("created_at", { ascending: true });

  return NextResponse.json({ user: auth, userErr, brands, brandErr });
}