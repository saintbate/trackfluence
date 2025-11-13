"use server";

import { getTikTokDaily, getTikTokMedia } from "@/lib/tiktok";
import { upsertAccountDaily, upsertMediaRows } from "@/lib/tiktok/persist";
import { TIKTOK_DEFAULT_ACCOUNT_ID } from "@/lib/env";

export async function refreshTikTok(brandId: string, from: string, to: string): Promise<{ saved: { daily: number; media: number } }> {
  const accountId = TIKTOK_DEFAULT_ACCOUNT_ID || "";
  const [daily, media] = await Promise.all([
    getTikTokDaily({ brandId, accountId, from, to }),
    getTikTokMedia({ brandId, accountId, from, to }),
  ]);
  const savedDaily = await upsertAccountDaily(brandId, accountId, daily);
  const savedMedia = await upsertMediaRows(brandId, accountId, media);
  return { saved: { daily: savedDaily, media: savedMedia } };
}


