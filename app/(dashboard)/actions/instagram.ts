"use server";

import { getInstagramDaily, getInstagramMedia } from "@/lib/instagram";
import { upsertAccountDaily, upsertMediaRows } from "@/lib/instagram/persist";
import { IG_DEFAULT_BUSINESS_ID } from "@/lib/env";

export async function refreshInstagram(brandId: string, from: string, to: string): Promise<{ saved: { daily: number; media: number } }> {
  const igUserId = IG_DEFAULT_BUSINESS_ID || "";
  const [daily, media] = await Promise.all([
    getInstagramDaily({ brandId, igUserId, from, to }),
    getInstagramMedia({ brandId, igUserId, from, to }),
  ]);
  const savedDaily = await upsertAccountDaily(brandId, igUserId, daily);
  const savedMedia = await upsertMediaRows(brandId, igUserId, media);
  return { saved: { daily: savedDaily, media: savedMedia } };
}


