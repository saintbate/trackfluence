import { NextResponse } from "next/server";
import { listBrandSocialAccounts, getSecret, setSecret, refreshInstagramToken, refreshTikTokToken } from "@/lib/social/tokens";
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = new URL(req.url).searchParams.get("auth");
  if (!auth || auth !== process.env.CRON_TOKEN_REFRESH_SECRET) {
    return new NextResponse("forbidden", { status: 403 });
  }

  // Ensure server client can write logs and bypass RLS as intended
  getServiceClient();

  const accounts = await listBrandSocialAccounts();
  const results: any[] = [];

  for (const acc of accounts) {
    try {
      const secret = await getSecret(acc.secret_key);
      if (!secret) {
        results.push({ acc: acc.id, platform: acc.platform, status: "skip_no_secret" });
        continue;
      }
      let newToken = secret;
      if (acc.platform === "instagram") newToken = await refreshInstagramToken(secret);
      if (acc.platform === "tiktok") newToken = await refreshTikTokToken(secret);
      if (newToken && newToken !== secret) {
        await setSecret(acc.secret_key, newToken);
        results.push({ acc: acc.id, platform: acc.platform, status: "rotated" });
      } else {
        results.push({ acc: acc.id, platform: acc.platform, status: "unchanged" });
      }
    } catch (e: any) {
      console.error("[token-refresh]", { acc }, e);
      results.push({ acc: acc.id, platform: acc.platform, status: "error", message: e?.message });
    }
  }

  return NextResponse.json({ ok: true, count: results.length, results });
}


