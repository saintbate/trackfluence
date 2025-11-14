/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

/**
 * KPI + influencer queries aligned to your actual schema:
 * report columns: id, brand_id, campaign_id, period_start, period_end, url, created_at,
 *                 influencer_id, revenue (numeric), num_orders (int)
 */

import { createServerClient } from "@/lib/supabase/server";
import type { KPIs } from "@/lib/kpis.shared";
import { EMPTY_KPIS } from "@/lib/kpis.shared";

/** Helpers */
function num(n: unknown): number {
  const v = typeof n === "string" ? Number(n) : (n as number | null | undefined);
  return Number.isFinite(v as number) ? (v as number) : 0;
}

const MIN_DATE = "0001-01-01";
const MAX_DATE = "9999-12-31";

/** Overview KPIs (safe fallbacks if fields don't exist) */
export async function getOverviewKpis(params: {
  brandId: string;
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
  campaignId?: string;
  limit?: number; // unused but kept for parity
}): Promise<KPIs> {
  if (!params.brandId) return EMPTY_KPIS;
  const supabase = createServerClient();

  try {
    let query = supabase
      .from("report")
      .select("revenue, num_orders, campaign_id", { count: "exact" })
      .eq("brand_id", params.brandId)
      .gte("period_start", params.from ?? MIN_DATE)
      .lte("period_end", params.to ?? MAX_DATE);

    if (params.campaignId) {
      query = query.eq("campaign_id", params.campaignId);
    }

    const { data, error } = await query;

    if (error) throw error;

    const rows = (data ?? []) as { revenue: unknown; num_orders: unknown; campaign_id: string | null }[];

    const totalRevenue = rows.reduce((a, r) => a + num(r.revenue), 0);
    const totalOrders = rows.reduce((a, r) => a + num(r.num_orders), 0);

    // If you don't track spend yet, keep spend = 0; ROAS/CAC are derived.
    const totalSpend = 0;
    const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
    const cac = totalOrders > 0 ? totalSpend / totalOrders : 0;

    const activeCampaigns = new Set(rows.map((r) => r.campaign_id).filter(Boolean)).size;

    return {
      totalSpend,
      totalRevenue,
      roas,
      cac,
      activeCampaigns,
    };
  } catch {
    return EMPTY_KPIS;
  }
}

/** Top influencers by revenue (includes handle/platform via FK) */
export async function getTopInfluencers(params: {
  brandId: string;
  from?: string;
  to?: string;
  campaignId?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ rows: { influencer_id: string; handle: string; platform: string | null; revenue: number; num_orders: number }[]; total: number; page: number; pageSize: number }> {
  const supabase = createServerClient();
  const pageSize = Math.max(params.pageSize ?? 10, 1);
  const page = Math.max(params.page ?? 1, 1);
  const offset = (page - 1) * pageSize;
  const rangeEnd = offset + pageSize - 1;

  let query = supabase
    .from("report")
    .select(
      `
      influencer_id,
      revenue,
      num_orders,
      campaign_id,
      influencer:influencer_id (
        handle,
        platform
      )
    `,
      { count: "exact" }
    )
    .eq("brand_id", params.brandId)
    .gte("period_start", params.from ?? MIN_DATE)
    .lte("period_end", params.to ?? MAX_DATE)
    .order("revenue", { ascending: false })
    .range(offset, rangeEnd);

  if (params.campaignId) {
    query = query.eq("campaign_id", params.campaignId);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  const rows = (data ?? []) as any[];

  return {
    rows: rows.map((r) => ({
      influencer_id: String(r.influencer_id ?? ""),
      handle: r?.influencer?.handle ?? "unknown",
      platform: r?.influencer?.platform ?? null,
      revenue: num(r.revenue),
      num_orders: num(r.num_orders),
    })),
    total: count ?? rows.length,
    page,
    pageSize,
  };
}

/** Revenue by influencer (for charts) */
export async function getRevenueByInfluencer(params: {
  brandId: string;
  from?: string;
  to?: string;
}): Promise<{ influencer_id: string; handle: string; platform: string | null; revenue: number; num_orders: number }[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("report")
    .select(
      `
      influencer_id,
      revenue,
      num_orders,
      influencer:influencer_id (
        handle,
        platform
      )
    `
    )
    .eq("brand_id", params.brandId)
    .gte("period_start", params.from ?? MIN_DATE)
    .lte("period_end", params.to ?? MAX_DATE)
    .order("revenue", { ascending: false });

  if (error) throw error;

  const rows = (data ?? []) as any[];

  return rows.map((r) => ({
    influencer_id: String(r.influencer_id ?? ""),
    handle: r?.influencer?.handle ?? "unknown",
    platform: r?.influencer?.platform ?? null,
    revenue: num(r.revenue),
    num_orders: num(r.num_orders),
  }));
}

export async function getRevenueTimeseries(params: {
  brandId: string;
  from?: string;
  to?: string;
  campaignId?: string;
}): Promise<{ date: string; revenue: number }[]> {
  const supabase = createServerClient();

  let query = supabase
    .from("report")
    .select("period_start, revenue")
    .eq("brand_id", params.brandId)
    .gte("period_start", params.from ?? MIN_DATE)
    .lte("period_end", params.to ?? MAX_DATE)
    .order("period_start", { ascending: true });

  if (params.campaignId) {
    query = query.eq("campaign_id", params.campaignId);
  }

  const { data, error } = await query;

  if (error) throw error;

  const totals = new Map<string, number>();

  for (const row of (data ?? []) as { period_start: string | null; revenue: unknown }[]) {
    const dateKey = row.period_start ? row.period_start.slice(0, 10) : null;
    if (!dateKey) continue;
    const current = totals.get(dateKey) ?? 0;
    totals.set(dateKey, current + num(row.revenue));
  }

  return Array.from(totals.entries())
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([date, revenue]) => ({ date, revenue }));
}

export async function getRevenueOrdersTimeseries(params: {
  brandId: string;
  from?: string;
  to?: string;
  campaignId?: string;
}): Promise<{ points: { date: string; revenue: number; orders: number }[]; totals: { revenue: number; orders: number } }> {
  const supabase = createServerClient();

  let query = supabase
    .from("report")
    .select("period_start, revenue, num_orders, campaign_id")
    .eq("brand_id", params.brandId)
    .gte("period_start", params.from ?? MIN_DATE)
    .lte("period_end", params.to ?? MAX_DATE)
    .order("period_start", { ascending: true });

  if (params.campaignId) {
    query = query.eq("campaign_id", params.campaignId);
  }

  const { data, error } = await query;
  if (error) throw error;

  const revenueTotals = new Map<string, number>();
  const orderTotals = new Map<string, number>();

  for (const row of (data ?? []) as { period_start: string | null; revenue: unknown; num_orders: unknown }[]) {
    const dateKey = row.period_start ? row.period_start.slice(0, 10) : null;
    if (!dateKey) continue;
    revenueTotals.set(dateKey, (revenueTotals.get(dateKey) ?? 0) + num(row.revenue));
    orderTotals.set(dateKey, (orderTotals.get(dateKey) ?? 0) + num(row.num_orders));
  }

  const dates = Array.from(new Set([...revenueTotals.keys(), ...orderTotals.keys()])).sort();
  const points = dates.map((d) => ({
    date: d,
    revenue: revenueTotals.get(d) ?? 0,
    orders: orderTotals.get(d) ?? 0,
  }));

  const totals = points.reduce(
    (acc, p) => {
      acc.revenue += p.revenue;
      acc.orders += p.orders;
      return acc;
    },
    { revenue: 0, orders: 0 }
  );

  return { points, totals };
}


