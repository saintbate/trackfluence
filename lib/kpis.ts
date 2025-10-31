"use server";

import { getServerClient } from "./supabase";
import type { OverviewKpis, TopInfluencerRow, RevenueByInfluencerPoint } from "./validator";

/**
 * Get overview KPIs for a brand.
 * 
 * @param brandId - Brand ID to filter by
 * @param accessToken - Optional access token for RLS
 * @returns Overview KPIs (totalSpend, totalRevenue, roas, cac, activeCampaigns)
 */
export async function getOverviewKpis({
  brandId,
  accessToken,
}: {
  brandId: string;
  accessToken?: string;
}): Promise<OverviewKpis> {
  const supabase = getServerClient(accessToken);

  // Get spend from shop_order.influencer_spend aggregated by brand_id
  const { data: spendData, error: spendError } = await supabase
    .from("shop_order")
    .select("influencer_spend")
    .eq("brand_id", brandId);

  if (spendError) {
    throw new Error(`Failed to fetch spend: ${spendError.message}`);
  }

  const totalSpend =
    spendData?.reduce((sum, row) => sum + (Number(row.influencer_spend) || 0), 0) || 0;

  // Get revenue from shop_order.revenue aggregated by brand_id
  const { data: revenueData, error: revenueError } = await supabase
    .from("shop_order")
    .select("revenue")
    .eq("brand_id", brandId);

  if (revenueError) {
    throw new Error(`Failed to fetch revenue: ${revenueError.message}`);
  }

  const totalRevenue =
    revenueData?.reduce((sum, row) => sum + (Number(row.revenue) || 0), 0) || 0;

  // Calculate ROAS
  const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0;

  // Get unique customer count for CAC calculation
  // TODO: If shop_order doesn't have customer_id, add it in a migration
  // For now, we'll use order count as a fallback
  const { data: customerData, error: customerError } = await supabase
    .from("shop_order")
    .select("id")
    .eq("brand_id", brandId);

  if (customerError) {
    throw new Error(`Failed to fetch customer data: ${customerError.message}`);
  }

  // TODO: Replace with COUNT(DISTINCT customer_id) when customer_id column exists
  const uniqueCustomers = customerData?.length || 0;
  const cac = uniqueCustomers > 0 ? totalSpend / uniqueCustomers : 0;

  // Get active campaigns count
  // TODO: If campaign table doesn't have status column, use end_date >= current date
  // For now, we'll count all campaigns for the brand
  const { data: campaignData, error: campaignError } = await supabase
    .from("campaign")
    .select("id, end_date")
    .eq("brand_id", brandId);

  if (campaignError) {
    throw new Error(`Failed to fetch campaigns: ${campaignError.message}`);
  }

  // Count active campaigns (end_date >= today or all if no status column)
  const today = new Date().toISOString().split("T")[0];
  const activeCampaigns =
    campaignData?.filter((c) => !c.end_date || c.end_date >= today).length || 0;

  return {
    totalSpend,
    totalRevenue,
    roas,
    cac,
    activeCampaigns,
  };
}

/**
 * Get top influencers by revenue for a brand.
 * 
 * @param brandId - Brand ID to filter by
 * @param limit - Maximum number of influencers to return (default: 5)
 * @param accessToken - Optional access token for RLS
 * @returns Array of top influencers with revenue, spend, and ROAS
 */
export async function getTopInfluencers({
  brandId,
  limit = 5,
  accessToken,
}: {
  brandId: string;
  limit?: number;
  accessToken?: string;
}): Promise<TopInfluencerRow[]> {
  const supabase = getServerClient(accessToken);

  // Get orders with influencer info
  const { data: orderData, error: orderError } = await supabase
    .from("shop_order")
    .select("influencer_id, revenue, influencer_spend")
    .eq("brand_id", brandId);

  if (orderError) {
    throw new Error(`Failed to fetch orders: ${orderError.message}`);
  }

  // Aggregate by influencer_id
  const influencerMap = new Map<string, { revenue: number; spend: number }>();

  for (const order of orderData || []) {
    if (!order.influencer_id) continue;

    const existing = influencerMap.get(order.influencer_id) || { revenue: 0, spend: 0 };
    influencerMap.set(order.influencer_id, {
      revenue: existing.revenue + (Number(order.revenue) || 0),
      spend: existing.spend + (Number(order.influencer_spend) || 0),
    });
  }

  // Get influencer details
  const influencerIds = Array.from(influencerMap.keys());
  if (influencerIds.length === 0) {
    return [];
  }

  const { data: influencerData, error: influencerError } = await supabase
    .from("influencer")
    .select("id, name, handle")
    .in("id", influencerIds);

  if (influencerError) {
    throw new Error(`Failed to fetch influencers: ${influencerError.message}`);
  }

  // Combine data and calculate ROAS
  const results: TopInfluencerRow[] = [];
  for (const inf of influencerData || []) {
    const stats = influencerMap.get(inf.id);
    if (!stats) continue;

    const roas = stats.spend > 0 ? stats.revenue / stats.spend : 0;
    results.push({
      influencer_id: inf.id,
      name: inf.name || inf.handle || `Influencer ${inf.id}`,
      revenue: stats.revenue,
      spend: stats.spend,
      roas,
    });
  }

  // Sort by revenue descending and limit
  results.sort((a, b) => b.revenue - a.revenue);
  return results.slice(0, limit);
}

/**
 * Get revenue by influencer for chart display.
 * 
 * @param brandId - Brand ID to filter by
 * @param limit - Maximum number of influencers to return (default: 10)
 * @param accessToken - Optional access token for RLS
 * @returns Array of influencers with revenue for chart
 */
export async function getRevenueByInfluencer({
  brandId,
  limit = 10,
  accessToken,
}: {
  brandId: string;
  limit?: number;
  accessToken?: string;
}): Promise<RevenueByInfluencerPoint[]> {
  const supabase = getServerClient(accessToken);

  // Get orders with influencer info
  const { data: orderData, error: orderError } = await supabase
    .from("shop_order")
    .select("influencer_id, revenue")
    .eq("brand_id", brandId);

  if (orderError) {
    throw new Error(`Failed to fetch orders: ${orderError.message}`);
  }

  // Aggregate by influencer_id
  const influencerMap = new Map<string, number>();

  for (const order of orderData || []) {
    if (!order.influencer_id) continue;
    const existing = influencerMap.get(order.influencer_id) || 0;
    influencerMap.set(order.influencer_id, existing + (Number(order.revenue) || 0));
  }

  // Get influencer details
  const influencerIds = Array.from(influencerMap.keys());
  if (influencerIds.length === 0) {
    return [];
  }

  const { data: influencerData, error: influencerError } = await supabase
    .from("influencer")
    .select("id, name, handle")
    .in("id", influencerIds);

  if (influencerError) {
    throw new Error(`Failed to fetch influencers: ${influencerError.message}`);
  }

  // Combine data
  const results: RevenueByInfluencerPoint[] = [];
  for (const inf of influencerData || []) {
    const revenue = influencerMap.get(inf.id);
    if (revenue === undefined) continue;

    results.push({
      name: inf.name || inf.handle || `Influencer ${inf.id}`,
      revenue,
    });
  }

  // Sort by revenue descending and limit
  results.sort((a, b) => b.revenue - a.revenue);
  return results.slice(0, limit);
}

