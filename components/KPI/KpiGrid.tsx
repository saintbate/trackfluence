"use client";

import * as React from "react";
import KpiCard from "./KpiCard";

export type Kpis = {
  totalSpend?: number;
  totalRevenue?: number;
  roas?: number;
  cac?: number;
  activeCampaigns?: number;
};

// Named export (optional wrapper)
export function KpiGridSection({
  children,
  ariaLive = "polite",
}: {
  children: React.ReactNode;
  ariaLive?: "off" | "polite" | "assertive";
}) {
  return (
    <section
      aria-live={ariaLive}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 sm:gap-5 lg:gap-6"
    >
      {children}
    </section>
  );
}

// Single default export
export default function KpiGrid({ kpis }: { kpis?: Kpis }) {
  const safe = {
    totalSpend: kpis?.totalSpend ?? 0,
    totalRevenue: kpis?.totalRevenue ?? 0,
    roas: kpis?.roas ?? 0,
    cac: kpis?.cac ?? 0,
    activeCampaigns: kpis?.activeCampaigns ?? 0,
  };
  return (
    <KpiGridSection>
      <KpiCard label="Total Spend" value={safe.totalSpend} format="currency" />
      <KpiCard label="Total Revenue" value={safe.totalRevenue} format="currency" />
      <KpiCard label="ROAS" value={safe.roas} format="ratio" />
      <KpiCard label="CAC" value={safe.cac} format="currency" />
      <KpiCard label="Active Campaigns" value={safe.activeCampaigns} format="int" />
    </KpiGridSection>
  );
}