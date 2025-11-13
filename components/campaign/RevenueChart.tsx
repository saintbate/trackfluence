"use client";

import RevenueArea from "@/components/charts/RevenueArea";

export default function RevenueChart({ timeseries }: { timeseries: { date: string; revenue: number }[] }) {
  const total = timeseries.reduce((a, p) => a + (Number.isFinite(p.revenue) ? p.revenue : 0), 0);
  const label = `Total ${new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(total)}`;
  return <RevenueArea data={timeseries} totalLabel={label} />;
}


