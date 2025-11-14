/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { exchangeCodeForToken, verifyAndConsumeState, saveTokenForAccount } from "@/lib/tiktok/oauth";
import { TIKTOK_BASE } from "@/lib/env";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state") ?? "";
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  if (!code || !state) {
    return NextResponse.redirect(`${site}/settings/accounts?error=missing_code`);
  }

  try {
    const sv = await verifyAndConsumeState(state);
    if (!sv?.brandId) return NextResponse.redirect(`${site}/settings/accounts?error=invalid_state`);
    const brandId = sv.brandId;
    const data = await exchangeCodeForToken(code);
    const accessToken = data.access_token;
    let platformUserId = data.business_account_id || "unknown";
    if (!data.business_account_id) {
      // Try to fetch a user id
      const base = TIKTOK_BASE ?? "https://business-api.tiktok.com";
      const meRes = await fetch(new URL("/open_api/v1.3/user/info/", base).toString(), {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      });
      const meJson = await meRes.json().catch(() => ({}));
      platformUserId = meJson?.data?.user?.id || meJson?.data?.creator_id || "unknown";
    }
    await saveTokenForAccount({ brandId, platformUserId, accessToken });
    return NextResponse.redirect(`${site}/settings/accounts?connected=tiktok`);
  } catch (e: any) {
    return NextResponse.redirect(`${site}/settings/accounts?error=${encodeURIComponent(e?.message ?? "unknown")}`);
  }
}


