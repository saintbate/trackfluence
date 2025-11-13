"use client";

import KpiCard from "@/components/KPI/KpiCard";

export type CampaignKpis = {
  totalSpend?: number;
  totalRevenue?: number;
  roas?: number;
  cac?: number;
  orders?: number;
  activeInfluencers?: number;
};

export default function CampaignKpiGrid({ kpis }: { kpis?: CampaignKpis }) {
  const safe = {
    totalSpend: kpis?.totalSpend ?? 0,
    totalRevenue: kpis?.totalRevenue ?? 0,
    roas: kpis?.roas ?? 0,
    cac: kpis?.cac ?? 0,
    orders: kpis?.orders ?? 0,
    activeInfluencers: kpis?.activeInfluencers ?? 0,
  };
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
      <KpiCard label="Total Spend" value={safe.totalSpend} format="currency" />
      <KpiCard label="Total Revenue" value={safe.totalRevenue} format="currency" />
      <KpiCard label="ROAS" value={safe.roas} format="ratio" />
      <KpiCard label="CAC" value={safe.cac} format="currency" />
      <KpiCard label="Orders" value={safe.orders} format="int" />
      <KpiCard label="Active Influencers" value={safe.activeInfluencers} format="int" />
    </section>
  );
}


