"use server";

import { SOCIAL_MOCK, TIKTOK_DEFAULT_ACCOUNT_ID } from "@/lib/env";
import type { AccountDaily, VideoRow } from "./types";
import { mockDaily, mockVideos } from "./mock";
import { fetchAccountDaily, fetchVideoRows } from "./adapter";

export async function getTikTokDaily(args: { brandId: string; accountId?: string; from: string; to: string }): Promise<AccountDaily[]> {
  const accountId = args.accountId || TIKTOK_DEFAULT_ACCOUNT_ID || "";
  if (!accountId || SOCIAL_MOCK) return mockDaily(args.brandId, args.from, args.to);
  try {
    return await fetchAccountDaily(accountId, args.from, args.to);
  } catch {
    return [];
  }
}

export async function getTikTokMedia(args: { brandId: string; accountId?: string; from: string; to: string }): Promise<VideoRow[]> {
  const accountId = args.accountId || TIKTOK_DEFAULT_ACCOUNT_ID || "";
  if (!accountId || SOCIAL_MOCK) return mockVideos(args.brandId, args.from, args.to);
  try {
    return await fetchVideoRows(accountId);
  } catch {
    return [];
  }
}


