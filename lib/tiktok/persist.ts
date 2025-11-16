/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createServerClient } from "@/lib/supabase/server";
import type { AccountDaily, VideoRow } from "./types";

export async function upsertAccountDaily(brandId: string, accountId: string, rows: AccountDaily[]): Promise<number> {
  if (!rows || rows.length === 0) return 0;
  const supabase = await createServerClient();
  const payload = rows.map((r) => ({
    brand_id: brandId,
    tiktok_business_account_id: accountId,
    date: r.date,
    followers: r.followers,
    views: r.views,
    likes: r.likes,
    comments: r.comments,
    shares: r.shares,
  }));
  const { error, count } = await (supabase as any)
    .from("tiktok_account_insights_daily")
    .upsert(payload, { onConflict: "brand_id,tiktok_business_account_id,date", ignoreDuplicates: false, count: "exact" });
  if (error) {
    console.error("[tiktok] upsertAccountDaily", error);
    return 0;
  }
  return count ?? payload.length;
}

export async function upsertMediaRows(brandId: string, accountId: string, rows: VideoRow[]): Promise<number> {
  if (!rows || rows.length === 0) return 0;
  const supabase = await createServerClient();
  const payload = rows.map((r) => ({
    brand_id: brandId,
    tiktok_business_account_id: accountId,
    video_id: r.video_id,
    title: r.title,
    permalink: r.permalink,
    posted_at: r.posted_at,
    views: r.views,
    likes: r.likes,
    comments: r.comments,
    shares: r.shares,
    avg_watch_time_seconds: r.avg_watch_time_seconds ?? null,
    completion_rate: r.completion_rate ?? null,
  }));
  const { error, count } = await (supabase as any)
    .from("tiktok_media_insights")
    .upsert(payload, { onConflict: "brand_id,video_id", ignoreDuplicates: false, count: "exact" });
  if (error) {
    console.error("[tiktok] upsertMediaRows", error);
    return 0;
  }
  return count ?? payload.length;
}


