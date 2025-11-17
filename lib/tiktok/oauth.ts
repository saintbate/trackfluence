/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import crypto from "crypto";
import { getServiceClient } from "@/lib/supabase";
import { TIKTOK_APP_ID, TIKTOK_CLIENT_SECRET, TIKTOK_BASE, TIKTOK_REDIRECT } from "@/lib/env";

const TokenResp = z.object({
  data: z.object({
    access_token: z.string(),
    refresh_token: z.string().optional(),
    expires_in: z.number().optional(),
    business_account_id: z.string().optional(),
  }),
});

async function postForm(path: string, body: Record<string, string>) {
  const u = new URL(path, TIKTOK_BASE ?? "https://business-api.tiktok.com");
  const res = await fetch(u.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body).toString(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`TikTok token exchange failed: ${res.status}`);
  return res.json();
}

export async function exchangeCodeForToken(code: string) {
  if (!TIKTOK_APP_ID || !TIKTOK_CLIENT_SECRET || !TIKTOK_REDIRECT) {
    throw new Error("TikTok OAuth not configured");
  }
  // Prefer Business API v1.3 endpoint if available; fallback to legacy form if needed
  const tokenUrl = new URL("/open_api/v1.3/oauth/token/", TIKTOK_BASE ?? "https://business-api.tiktok.com");
  const res = await fetch(tokenUrl.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      app_id: TIKTOK_APP_ID,
      app_secret: TIKTOK_CLIENT_SECRET,
      grant_type: "authorization_code",
      auth_code: code,
      redirect_uri: TIKTOK_REDIRECT,
    }),
    cache: "no-store",
  });
  const json = res.ok ? await res.json() : await postForm("/oauth/access_token/", {
    client_key: TIKTOK_APP_ID,
    client_secret: TIKTOK_CLIENT_SECRET,
    code,
    grant_type: "authorization_code",
    redirect_uri: TIKTOK_REDIRECT,
  });
  return TokenResp.parse(json).data;
}

/** Store token+refresh in public.secrets and link in brand_social_account. */
export async function attachTikTokAccount(opts: {
  brandId: string;
  token: string;
  businessAccountId?: string;
  accountName?: string;
}) {
  const supa = getServiceClient();
  const secretKey = `tiktok:${opts.brandId}:${opts.businessAccountId ?? "unknown"}`;
  await (supa as any).from("secrets").upsert({ key: secretKey, value: opts.token });
  await (supa as any).from("brand_social_account").upsert(
    {
      brand_id: opts.brandId,
      platform: "tiktok",
      external_account_id: opts.businessAccountId ?? "unknown",
      account_name: opts.accountName ?? null,
      secret_key: secretKey,
    },
    { onConflict: "brand_id,platform,external_account_id" } as any
  );
}

/** Disconnect: delete brand_social_account row and the secret key */
export async function detachTikTokAccount(brandId: string, businessAccountId: string) {
  const supa = getServiceClient();
  const secretKey = `tiktok:${brandId}:${businessAccountId}`;
  await supa.from("brand_social_account").delete().match({
    brand_id: brandId,
    platform: "tiktok",
    external_account_id: businessAccountId,
  });
  await supa.from("secrets").delete().eq("key", secretKey);
}

export function generateState(): string {
  return crypto.randomBytes(16).toString("hex");
}

export async function storeState(state: string, payload: { userId: string; brandId: string }) {
  const supa = getServiceClient();
  await (supa as any).from("secrets").upsert({
    key: `oauth:tiktok:state:${state}`,
    value: JSON.stringify({ ...payload, createdAt: Date.now() }),
  });
}

export async function verifyAndConsumeState(state: string): Promise<{ userId: string; brandId: string } | null> {
  const supa = getServiceClient();
  const { data } = await (supa as any)
    .from("secrets")
    .select("value")
    .eq("key", `oauth:tiktok:state:${state}`)
    .maybeSingle();
  if (!data?.value) return null;
  await (supa as any).from("secrets").delete().eq("key", `oauth:tiktok:state:${state}`);
  try {
    const parsed = JSON.parse(data.value as string);
    return { userId: parsed.userId, brandId: parsed.brandId };
  } catch {
    return null;
  }
}

export async function saveTokenForAccount(params: {
  brandId: string;
  platformUserId: string;
  accessToken: string;
}) {
  const supa = getServiceClient();
  const secretKey = `tiktok:acct:${params.platformUserId}:token`;
  await (supa as any).from("secrets").upsert({ key: secretKey, value: params.accessToken });
  await (supa as any).from("brand_social_account").upsert(
    {
      brand_id: params.brandId,
      platform: "tiktok",
      external_account_id: params.platformUserId,
      secret_key: secretKey,
    },
    { onConflict: "brand_id,platform,external_account_id" } as any
  );
}


