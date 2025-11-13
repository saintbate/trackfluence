import { createServerClient } from "@/lib/supabase/server";
import { calcOffset } from "@/lib/paging";

export type InfluencerBasics = {
  id: string;
  handle: string;
  platform: string | null;
};

export type InfluencerTimeseriesPoint = { d: string; revenue: number };

export async function getInfluencerBasics(id: string): Promise<InfluencerBasics | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase.from("influencer").select("id, handle, platform").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return { id: data.id, handle: data.handle ?? "unknown", platform: data.platform ?? null };
}

export async function getInfluencerTimeseries(params: {
  influencerId: string;
  brandId: string;
  from?: string;
  to?: string;
  campaignId?: string;
}): Promise<InfluencerTimeseriesPoint[]> {
  const supabase = createServerClient();
  let q = supabase
    .from("report")
    .select("period_start, revenue, influencer_id, campaign_id")
    .eq("brand_id", params.brandId)
    .eq("influencer_id", params.influencerId)
    .order("period_start", { ascending: true });
  if (params.from) q = q.gte("period_start", params.from);
  if (params.to) q = q.lte("period_end", params.to);
  if (params.campaignId) q = q.eq("campaign_id", params.campaignId);
  const { data, error } = await q;
  if (error) throw error;
  const byDay = new Map<string, number>();
  for (const row of (data ?? []) as { period_start: string | null; revenue: number | string | null }[]) {
    const d = row.period_start?.slice(0, 10);
    if (!d) continue;
    const v = typeof row.revenue === "string" ? Number(row.revenue) : row.revenue ?? 0;
    byDay.set(d, (byDay.get(d) ?? 0) + (Number.isFinite(v) ? (v as number) : 0));
  }
  return Array.from(byDay.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([d, revenue]) => ({ d, revenue }));
}

export async function getInfluencerActivity(params: {
  influencerId: string;
  brandId: string;
  from?: string;
  to?: string;
  campaignId?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ rows: any[]; total: number; page: number; pageSize: number }> {
  const supabase = createServerClient();
  const page = Math.max(1, Math.floor(params.page || 1));
  const pageSize = Math.max(1, Math.floor(params.pageSize || 20));
  const { from, to } = calcOffset(page, pageSize);
  let q = supabase
    .from("report")
    .select("period_start, period_end, campaign_id, url, revenue, num_orders, campaign:campaign_id(name)", { count: "exact" })
    .eq("brand_id", params.brandId)
    .eq("influencer_id", params.influencerId)
    .order("period_start", { ascending: false })
    .range(from, to);
  if (params.from) q = q.gte("period_start", params.from);
  if (params.to) q = q.lte("period_end", params.to);
  if (params.campaignId) q = q.eq("campaign_id", params.campaignId);
  const { data, error, count } = await q;
  if (error) throw error;
  return { rows: data ?? [], total: count ?? 0, page, pageSize };
}


