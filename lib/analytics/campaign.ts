/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createServerClient } from "@/lib/supabase/server";

export type CampaignKpis = {
  totalSpend: number;
  totalRevenue: number;
  roas: number;
  cac: number;
  orders: number;
  activeInfluencers: number;
};

const EMPTY_KPIS: CampaignKpis = {
  totalSpend: 0,
  totalRevenue: 0,
  roas: 0,
  cac: 0,
  orders: 0,
  activeInfluencers: 0,
};

function num(n: unknown): number {
  const v = typeof n === "string" ? Number(n) : (n as number | null | undefined);
  return Number.isFinite(v as number) ? (v as number) : 0;
}

export async function getCampaignKpis(campaignId: string, dateFrom: string | null, dateTo: string | null): Promise<CampaignKpis> {
  if (!campaignId) return EMPTY_KPIS;
  const supabase = createServerClient();
  try {
    let query = supabase
      .from("report")
      .select("revenue, num_orders, influencer_id, period_start, period_end")
      .eq("campaign_id", campaignId);
    if (dateFrom) query = query.gte("period_start", dateFrom);
    if (dateTo) query = query.lte("period_end", dateTo);

    const { data, error } = await query;
    if (error) throw error;
    const rows = (data ?? []) as { revenue: unknown; num_orders: unknown; influencer_id: string | null }[];
    const totalRevenue = rows.reduce((a, r) => a + num(r.revenue), 0);
    const orders = rows.reduce((a, r) => a + num(r.num_orders), 0);
    const totalSpend = 0; // not tracked yet
    const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
    const cac = orders > 0 ? totalSpend / orders : 0;
    const activeInfluencers = new Set(rows.map((r) => r.influencer_id).filter(Boolean)).size;
    return { totalSpend, totalRevenue, roas, cac, orders, activeInfluencers };
  } catch {
    return EMPTY_KPIS;
  }
}

export async function getCampaignRevenueTimeseries(campaignId: string, dateFrom: string | null, dateTo: string | null): Promise<{ date: string; revenue: number }[]> {
  if (!campaignId) return [];
  const supabase = createServerClient();
  try {
    let query = supabase
      .from("report")
      .select("period_start, revenue")
      .eq("campaign_id", campaignId)
      .order("period_start", { ascending: true });
    if (dateFrom) query = query.gte("period_start", dateFrom);
    if (dateTo) query = query.lte("period_end", dateTo);
    const { data, error } = await query;
    if (error) throw error;
    const totals = new Map<string, number>();
    for (const row of (data ?? []) as { period_start: string | null; revenue: unknown }[]) {
      const dateKey = row.period_start ? row.period_start.slice(0, 10) : null;
      if (!dateKey) continue;
      totals.set(dateKey, (totals.get(dateKey) ?? 0) + num(row.revenue));
    }
    return Array.from(totals.entries())
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([date, revenue]) => ({ date, revenue }));
  } catch {
    return [];
  }
}

export async function getTopInfluencersForCampaign(campaignId: string, dateFrom: string | null, dateTo: string | null): Promise<{ influencer_name: string; platform: string; revenue: number; orders: number }[]> {
  if (!campaignId) return [];
  const supabase = createServerClient();
  try {
    let query = supabase
      .from("report")
      .select(
        `
        influencer_id,
        revenue,
        num_orders,
        influencer:influencer_id (
          handle,
          platform
        ),
        period_start,
        period_end
      `
      )
      .eq("campaign_id", campaignId)
      .order("revenue", { ascending: false });
    if (dateFrom) query = query.gte("period_start", dateFrom);
    if (dateTo) query = query.lte("period_end", dateTo);
    const { data, error } = await query;
    if (error) throw error;
    const rows = (data ?? []) as any[];
    return rows.map((r) => ({
      influencer_name: r?.influencer?.handle ?? "unknown",
      platform: r?.influencer?.platform ?? "",
      revenue: num(r.revenue),
      orders: num(r.num_orders),
    }));
  } catch {
    return [];
  }
}


