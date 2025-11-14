/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
"use server";

import { TIKTOK_DEFAULT_ACCOUNT_ID } from "@/lib/env";
import { fetchJsonRetry } from "./util";
import type { AccountDaily, VideoRow } from "./types";

function authHeaders() {
  // Placeholder: supply server token via secrets if implemented
  return { "content-type": "application/json" };
}

export async function fetchAccountDaily(accountId: string, from: string, to: string): Promise<AccountDaily[]> {
  // Endpoint path may vary by API version; keep flexible in util
  const path = `/content/business/account/metrics/get?business_account_id=${encodeURIComponent(accountId)}&from=${from}&to=${to}`;
  const json = await fetchJsonRetry<any>(path, { headers: authHeaders(), cache: "no-store" });
  const rows: AccountDaily[] = Array.isArray(json?.data)
    ? json.data.map((d: any) => ({
        date: String(d?.date ?? "").slice(0, 10),
        followers: Number(d?.followers ?? 0),
        views: Number(d?.views ?? 0),
        likes: Number(d?.likes ?? 0),
        comments: Number(d?.comments ?? 0),
        shares: Number(d?.shares ?? 0),
      }))
    : [];
  return rows.filter((r) => r.date);
}

export async function fetchVideoList(accountId: string): Promise<any[]> {
  const path = `/content/business/video/list?business_account_id=${encodeURIComponent(accountId)}`;
  const json = await fetchJsonRetry<any>(path, { headers: authHeaders(), cache: "no-store" });
  return Array.isArray(json?.data) ? json.data : [];
}

export async function fetchVideoMetrics(videoId: string): Promise<Record<string, number>> {
  const path = `/content/business/video/metrics/get?video_id=${encodeURIComponent(videoId)}`;
  const json = await fetchJsonRetry<any>(path, { headers: authHeaders(), cache: "no-store" });
  const out: Record<string, number> = {};
  for (const row of Array.isArray(json?.data) ? json.data : []) {
    out[String(row?.name)] = Number(row?.value ?? 0);
  }
  return out;
}

export async function fetchVideoRows(accountId: string): Promise<VideoRow[]> {
  const list = await fetchVideoList(accountId);
  const rows: VideoRow[] = [];
  for (const v of list) {
    const metrics = await fetchVideoMetrics(String(v?.id));
    rows.push({
      video_id: String(v?.id),
      title: v?.title,
      permalink: v?.permalink,
      posted_at: v?.posted_at,
      views: Number(metrics.views ?? 0),
      likes: Number(metrics.likes ?? 0),
      comments: Number(metrics.comments ?? 0),
      shares: Number(metrics.shares ?? 0),
      avg_watch_time_seconds: Number(metrics.avg_watch_time_seconds ?? 0),
      completion_rate: Number(metrics.completion_rate ?? 0),
    });
  }
  return rows;
}


