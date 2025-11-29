// app/(dashboard)/influencers/page.tsx

import { Suspense } from "react";
import Link from "next/link";
import { FlaskConical } from "lucide-react";
import DemoBanner from "@/components/demo-banner";
import { isDemoSearchParam } from "@/lib/demo-mode";
import { getDemoCreatorsDashboardData, type DemoCreator } from "@/lib/demo-data";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function statusBadge(status: DemoCreator["status"]) {
  switch (status) {
    case "active":
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-950/60 px-2 py-0.5 text-[10px] font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/30">
          Active
        </span>
      );
    case "paused":
      return (
        <span className="inline-flex items-center rounded-full bg-red-950/60 px-2 py-0.5 text-[10px] font-medium text-red-300 ring-1 ring-inset ring-red-500/30">
          Paused
        </span>
      );
    case "needs_attention":
      return (
        <span className="inline-flex items-center rounded-full bg-amber-950/60 px-2 py-0.5 text-[10px] font-medium text-amber-300 ring-1 ring-inset ring-amber-500/30">
          Needs Attention
        </span>
      );
    default:
      return null;
  }
}

function roasColor(roas: number): string {
  if (roas >= 2.5) return "text-emerald-400";
  if (roas >= 1.5) return "text-amber-300";
  if (roas >= 1) return "text-zinc-300";
  return "text-red-400";
}

function CreatorCard({ creator, isDemo }: { creator: DemoCreator; isDemo: boolean }) {
  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-5 shadow-lg shadow-black/30">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 text-sm font-medium">
            {creator.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <h3 className="font-medium text-zinc-100">{creator.name}</h3>
            <p className="text-xs text-zinc-500">{creator.handle}</p>
          </div>
        </div>
        {statusBadge(creator.status)}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-zinc-500">ROAS</p>
          <p className={`text-lg font-semibold ${roasColor(creator.roas)}`}>
            {creator.roas.toFixed(1)}×
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-zinc-500">Revenue</p>
          <p className="text-lg font-semibold text-zinc-100">
            {formatCurrency(creator.revenue)}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-zinc-500">Spend</p>
          <p className="text-lg font-semibold text-zinc-100">
            {formatCurrency(creator.spend)}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-zinc-500">CTR</p>
          <p className="text-lg font-semibold text-zinc-100">{creator.ctr.toFixed(1)}%</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-zinc-800/60 pt-4">
        <div className="flex items-center gap-4 text-xs text-zinc-400">
          <span>{formatNumber(creator.impressions)} impressions</span>
          <span>·</span>
          <span>{formatNumber(creator.clicks)} clicks</span>
          <span>·</span>
          <span>{formatNumber(creator.orders)} orders</span>
        </div>
        {/* Actions disabled in demo mode */}
        {isDemo && (
          <button
            disabled
            className="rounded-md bg-zinc-800/50 px-2 py-1 text-[10px] text-zinc-500 cursor-not-allowed"
            title="Actions are disabled in demo mode. Connect TikTok to manage creators."
          >
            Manage
          </button>
        )}
      </div>
    </div>
  );
}

function KpiCard({ label, value, subtext }: { label: string; value: string; subtext?: string }) {
  return (
    <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4">
      <p className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-zinc-100">{value}</p>
      {subtext && <p className="mt-0.5 text-xs text-zinc-500">{subtext}</p>}
    </div>
  );
}

export default async function InfluencersIndexPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const isDemo = isDemoSearchParam(params);

  // If not in demo mode, show the placeholder
  if (!isDemo) {
    return (
      <div className="p-6">
        <h1 data-page-title className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Influencers
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Coming soon.{" "}
          <Link href="/influencers?demo=1" className="text-emerald-500 underline underline-offset-2 hover:text-emerald-400">
            Try demo mode
          </Link>{" "}
          to preview the dashboard.
        </p>
      </div>
    );
  }

  // Demo mode: show the creators dashboard
  const { creators, kpis } = await getDemoCreatorsDashboardData();

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-zinc-200">
      <div className="mx-auto w-full max-w-6xl flex flex-col gap-6 p-6 pb-20">
        
        {/* Demo Banner */}
        <Suspense fallback={null}>
          <div className="flex justify-center">
            <DemoBanner isDemo={isDemo} />
          </div>
        </Suspense>

        {/* Header */}
        <header className="flex flex-col gap-2 border-b border-zinc-800 pb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight text-zinc-50">
              Creators
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
              <FlaskConical className="h-3 w-3" />
              Demo Mode
            </span>
          </div>
          <p className="text-xs text-zinc-500">
            Performance breakdown for all your TikTok creators.
          </p>
        </header>

        {/* KPI Summary */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-zinc-100">Performance Summary</h2>
            <p className="text-[10px] text-amber-500/70">Based on sample data</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <KpiCard 
              label="Total Spend" 
              value={formatCurrency(kpis.totalSpend)} 
              subtext="Last 30 days"
            />
            <KpiCard 
              label="Total Revenue" 
              value={formatCurrency(kpis.totalRevenue)} 
              subtext="Last 30 days"
            />
            <KpiCard 
              label="Overall ROAS" 
              value={`${kpis.roas.toFixed(1)}×`} 
            />
            <KpiCard 
              label="Active Creators" 
              value={String(creators.filter(c => c.status === "active").length)} 
              subtext={`of ${creators.length} total`}
            />
          </div>
        </section>

        {/* Creators Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-100">All Creators</h2>
            {/* Sync button disabled in demo */}
            <button
              disabled
              className="rounded-md bg-zinc-800/50 px-3 py-1.5 text-xs text-zinc-500 cursor-not-allowed"
              title="Sync is disabled in demo mode. Connect TikTok to sync real data."
            >
              Sync Creators
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {creators.map((creator) => (
              <CreatorCard key={creator.id} creator={creator} isDemo={isDemo} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
