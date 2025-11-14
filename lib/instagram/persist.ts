/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createServerClient } from "@/lib/supabase/server";
import type { AccountDaily, MediaRow } from "./types";

export async function upsertAccountDaily(brandId: string, igUserId: string, rows: AccountDaily[]): Promise<number> {
  if (!rows || rows.length === 0) return 0;
  const supabase = createServerClient();
  const payload = rows.map((r) => ({
    brand_id: brandId,
    ig_user_id: igUserId,
    date: r.date,
    impressions: r.impressions,
    reach: r.reach,
    profile_views: r.profile_views,
    follower_count: r.follower_count,
  }));
  const { error, count } = await (supabase as any)
    .from("ig_account_insights_daily")
    .upsert(payload, { onConflict: "brand_id,ig_user_id,date", ignoreDuplicates: false, count: "exact" });
  if (error) {
    console.error("[ig] upsertAccountDaily", error);
    return 0;
  }
  return count ?? payload.length;
}

export async function upsertMediaRows(brandId: string, igUserId: string, rows: MediaRow[]): Promise<number> {
  if (!rows || rows.length === 0) return 0;
  const supabase = createServerClient();
  const payload = rows.map((r) => ({
    brand_id: brandId,
    ig_user_id: igUserId,
    media_id: r.media_id,
    media_type: r.media_type,
    permalink: r.permalink,
    caption: r.caption,
    posted_at: r.posted_at,
    impressions: r.impressions,
    reach: r.reach,
    engagement: r.engagement,
    likes: r.likes,
    comments: r.comments,
    saves: r.saves,
    video_views: r.video_views ?? 0,
    plays: r.plays ?? 0,
  }));
  const { error, count } = await (supabase as any)
    .from("ig_media_insights")
    .upsert(payload, { onConflict: "brand_id,media_id", ignoreDuplicates: false, count: "exact" });
  if (error) {
    console.error("[ig] upsertMediaRows", error);
    return 0;
  }
  return count ?? payload.length;
}


