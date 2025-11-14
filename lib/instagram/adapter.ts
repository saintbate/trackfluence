/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { META_BASE, IG_SYSTEM_TOKEN } from "@/lib/env";
import { fetchJsonRetry } from "./util";
import type { AccountDaily, MediaRow } from "./types";

function authHeader() {
  if (!IG_SYSTEM_TOKEN) throw new Error("Missing IG_SYSTEM_USER_TOKEN");
  return { Authorization: `Bearer ${IG_SYSTEM_TOKEN}` };
}

export async function fetchAccountInfo(igUserId: string): Promise<any> {
  const url = `${META_BASE}/${igUserId}?fields=id,username,profile_picture_url,followers_count,media_count`;
  return await fetchJsonRetry<any>(url, { headers: authHeader(), cache: "no-store" });
}

export async function fetchAccountDaily(igUserId: string, from: string, to: string): Promise<AccountDaily[]> {
  const url = `${META_BASE}/${igUserId}/insights?metric=impressions,reach,profile_views,follower_count&period=day&since=${from}&until=${to}`;
  const json = await fetchJsonRetry<any>(url, { headers: authHeader(), cache: "no-store" });
  // Normalize minimal expected shape
  // The real payload returns arrays per metric; we map by date.
  const byMetric: Record<string, { end_time: string; value: number }[]> = Object.create(null);
  for (const m of Array.isArray(json?.data) ? json.data : []) {
    byMetric[m?.name] = m?.values ?? [];
  }
  const dates = new Set<string>();
  Object.values(byMetric).forEach((arr) => arr.forEach((v) => dates.add(v.end_time?.slice(0, 10))));
  return Array.from(dates)
    .sort()
    .map((date) => ({
      date,
      impressions: (byMetric["impressions"]?.find((v) => v.end_time?.startsWith(date))?.value as number) ?? 0,
      reach: (byMetric["reach"]?.find((v) => v.end_time?.startsWith(date))?.value as number) ?? 0,
      profile_views: (byMetric["profile_views"]?.find((v) => v.end_time?.startsWith(date))?.value as number) ?? 0,
      follower_count: (byMetric["follower_count"]?.find((v) => v.end_time?.startsWith(date))?.value as number) ?? 0,
    }));
}

export async function fetchMediaList(igUserId: string): Promise<any[]> {
  const url = `${META_BASE}/${igUserId}/media?fields=id,caption,media_type,media_url,permalink,timestamp,thumbnail_url,owner&limit=50`;
  const json = await fetchJsonRetry<any>(url, { headers: authHeader(), cache: "no-store" });
  return Array.isArray(json?.data) ? json.data : [];
}

export async function fetchMediaInsights(mediaId: string): Promise<Record<string, number>> {
  const url = `${META_BASE}/${mediaId}/insights?metric=impressions,reach,engagement,likes,comments,saves,video_views,plays`;
  const json = await fetchJsonRetry<any>(url, { headers: authHeader(), cache: "no-store" });
  const out: Record<string, number> = {};
  for (const row of Array.isArray(json?.data) ? json.data : []) {
    out[row?.name] = Number(row?.values?.[0]?.value ?? 0);
  }
  return out;
}

export async function fetchMediaRows(igUserId: string): Promise<MediaRow[]> {
  const list = await fetchMediaList(igUserId);
  const rows: MediaRow[] = [];
  for (const m of list) {
    const metrics = await fetchMediaInsights(String(m.id));
    rows.push({
      media_id: String(m.id),
      media_type: m.media_type,
      permalink: m.permalink,
      caption: m.caption,
      posted_at: m.timestamp,
      impressions: metrics.impressions ?? 0,
      reach: metrics.reach ?? 0,
      engagement: metrics.engagement ?? 0,
      likes: metrics.likes ?? 0,
      comments: metrics.comments ?? 0,
      saves: metrics.saves ?? 0,
      video_views: metrics.video_views ?? 0,
      plays: metrics.plays ?? 0,
    });
  }
  return rows;
}


