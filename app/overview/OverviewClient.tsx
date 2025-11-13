// app/overview/OverviewClient.tsx
"use client";

import { useMemo } from "react";
import CampaignOverview, { type Campaign } from "@/components/CampaignOverview";
import CreateBrandModal from "@/components/CreateBrandModal";
import type { Brand } from "@/lib/types";

// Use the Campaign type from CampaignOverview to avoid drift

type KPIs = {
  totalSpend: number;
  totalRevenue: number;
  roas: number;
  cac: number;
  activeCampaigns: number;
};

type TopRow = {
  influencer_id: string;
  handle: string;
  platform: string;
  revenue: number;
  num_orders: number;
};

type RevRow = {
  influencer_id: string;
  handle: string;
  platform: string;
  revenue: number;
};

export default function OverviewClient(props: {
  accessToken: string | null;
  brands: Brand[];
  campaigns: Campaign[];
  initialKpis: KPIs;
  initialTopInfluencers: TopRow[];
  initialRevenue: RevRow[];
  dateFrom: string;
  dateTo: string;
}) {
  const {
    accessToken,
    brands,
    campaigns,
    initialKpis,
    initialTopInfluencers,
    initialRevenue,
    dateFrom,
    dateTo,
  } = props;

  // Stable derived values
  const brandId = brands.length > 0 ? brands[0].id : null;

  // Tiny debug strip so we always see *something* even if data is empty.
  const Debug = useMemo(
    () => (
      <div className="mb-4 rounded-lg border p-3 text-xs text-slate-400">
        <div className="font-medium text-slate-300">Debug</div>
        <div>accessToken: {accessToken ? "present" : "null"}</div>
        <div>brands: {brands.length}</div>
        <div>campaigns: {campaigns.length}</div>
        <div>dateFrom → dateTo: {dateFrom} → {dateTo}</div>
      </div>
    ),
    [accessToken, brands.length, campaigns.length, dateFrom, dateTo]
  );

  return (
    <main className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Overview</h1>
        {/* The action is optional; if it exists, CreateBrandModal will use it */}
        <CreateBrandModal />
      </div>

      {Debug}

      {/* Brands list (simple, always visible) */}
      <section className="mb-6">
        <div className="mb-2 text-sm text-slate-300">Your Brands</div>
        {brands.length === 0 ? (
          <div className="rounded-lg border p-3 text-slate-400">
            No brands yet. Create one to get started.
          </div>
        ) : (
          <ul className="space-y-2">
            {brands.map((b) => (
              <li key={b.id} className="rounded-lg border p-3">
                <div className="font-medium">{b.name}</div>
                {b.owner_user_email || b.owner_user_id ? (
                  <div className="text-xs text-slate-400">
                    {b.owner_user_email ?? b.owner_user_id}
                  </div>
                 ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Dashboard */}
      {brandId ? (
        <CampaignOverview
          brandId={brandId}
          campaigns={campaigns}
          initialKpis={initialKpis}
          initialTopInfluencers={initialTopInfluencers}
          initialRevenue={initialRevenue}
          dateFrom={dateFrom}
          dateTo={dateTo}
        />
      ) : (
        <div className="rounded-lg border p-8 text-center text-slate-400">
          Create a brand to see your KPIs and analytics.
        </div>
      )}
    </main>
  );
}