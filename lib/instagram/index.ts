"use server";

import { SOCIAL_MOCK, IG_DEFAULT_BUSINESS_ID } from "@/lib/env";
import type { AccountDaily, MediaRow } from "./types";
import { mockDaily, mockMedia } from "./mock";
import { fetchAccountDaily, fetchMediaRows } from "./adapter";

export async function getInstagramDaily(args: { brandId: string; igUserId?: string; from: string; to: string }): Promise<AccountDaily[]> {
  const igUserId = args.igUserId || IG_DEFAULT_BUSINESS_ID || "";
  if (!igUserId || SOCIAL_MOCK) return mockDaily(args.brandId, args.from, args.to);
  try {
    return await fetchAccountDaily(igUserId, args.from, args.to);
  } catch {
    return [];
  }
}

export async function getInstagramMedia(args: { brandId: string; igUserId?: string; from: string; to: string }): Promise<MediaRow[]> {
  const igUserId = args.igUserId || IG_DEFAULT_BUSINESS_ID || "";
  if (!igUserId || SOCIAL_MOCK) return mockMedia(args.brandId, args.from, args.to);
  try {
    return await fetchMediaRows(igUserId);
  } catch {
    return [];
  }
}


