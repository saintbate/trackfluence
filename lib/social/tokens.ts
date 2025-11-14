/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServiceClient } from "@/lib/supabase";

type Platform = "instagram" | "tiktok";

export async function getSecret(key: string) {
  const supa = getServiceClient();
  const { data, error } = await (supa as any).from("secrets").select("value").eq("key", key).maybeSingle();
  if (error) throw error;
  return (data?.value as string | undefined) ?? undefined;
}

export async function setSecret(key: string, value: string) {
  const supa = getServiceClient();
  const { error } = await (supa as any).from("secrets").upsert({ key, value });
  if (error) throw error;
}

export async function listBrandSocialAccounts(platform?: Platform) {
  const supa = getServiceClient();
  let q = (supa as any).from("brand_social_account").select("*");
  if (platform) q = q.eq("platform", platform);
  const { data, error } = await q;
  if (error) throw error;
  return (data as any[]) ?? [];
}

/** IG long-lived refresh: https://developers.facebook.com/docs/instagram-basic-display-api/guides/long-lived-access-tokens/ */
export async function refreshInstagramToken(oldToken: string) {
  const apiBase = process.env.INSTAGRAM_API_BASE ?? "https://graph.facebook.com";
  const url = new URL("/v21.0/oauth/access_token", apiBase);
  url.searchParams.set("grant_type", "ig_refresh_token");
  url.searchParams.set("access_token", oldToken);
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`IG refresh failed: ${res.status}`);
  const json = await res.json();
  return (json?.access_token as string) ?? oldToken;
}

/** TikTok refresh — varies by app type; implement when refresh_token is available. */
export async function refreshTikTokToken(oldToken: string) {
  // Fallback behavior: return old token, re-auth may be needed if expired.
  return oldToken;
}


