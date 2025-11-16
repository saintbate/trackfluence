import { NextResponse } from "next/server";
import { TIKTOK_APP_ID, TIKTOK_REDIRECT, TIKTOK_BASE } from "@/lib/env";
import { createServerClient } from "@/lib/supabase/server";
import { generateState, storeState } from "@/lib/tiktok/oauth";

export async function GET(req: Request) {
  const supaAuth = await createServerClient();
  const { data: { user } } = await supaAuth.auth.getUser();
  const u = new URL(req.url);
  const brandId = u.searchParams.get("brandId");
  if (!user?.id) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  if (!brandId) return NextResponse.json({ ok: false, error: "Missing brandId" }, { status: 400 });
  const state = generateState();
  await storeState(state, { userId: user.id, brandId });

  if (!TIKTOK_APP_ID || !TIKTOK_REDIRECT) {
    return NextResponse.json({ ok: false, error: "TikTok OAuth not configured" }, { status: 500 });
  }

  const base = TIKTOK_BASE ?? "https://business-api.tiktok.com";
  const auth = new URL("/open_api/v1.3/oauth/authorize", base);
  auth.searchParams.set("app_id", TIKTOK_APP_ID);
  auth.searchParams.set("response_type", "code");
  auth.searchParams.set("scope", "user.info.basic,video.list,insights.basic");
  auth.searchParams.set("redirect_uri", TIKTOK_REDIRECT);
  auth.searchParams.set("state", state);

  return NextResponse.redirect(auth.toString());
}


