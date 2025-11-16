// app/api/debug/whoami/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerClient();
  const { data: { user }, error: userErr } = await supabase.auth.getUser();

  return NextResponse.json({
    ok: true,
    user,
    userErr: userErr ?? null,
  });
}