"use client";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json());

type Campaign = {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
};

export default function CampaignControls({
  brandId,
  onChange,
  initialFrom,
  initialTo
}: {
  brandId: string;
  onChange: (p: { campaignId: string | null; from: string; to: string }) => void;
  initialFrom?: string;
  initialTo?: string;
}) {
  const { data, error, isLoading } = useSWR<{ campaigns: Campaign[] }>(
    `/api/campaigns?brandId=${brandId}`,
    fetcher
  );

  const campaigns = data?.campaigns ?? [];

  const [allCampaigns, setAllCampaigns] = useState(false);
  const [campaignId, setCampaignId] = useState<string | null>(campaigns[0]?.id ?? null);
  const [from, setFrom] = useState<string>(initialFrom ?? campaigns[0]?.start_date ?? "");
  const [to, setTo] = useState<string>(initialTo ?? campaigns[0]?.end_date ?? "");

  // Fetch brand date bounds when "All campaigns" is enabled
  const { data: dateBounds } = useSWR<{ min: string | null; max: string | null }>(
    allCampaigns ? `/api/brand-date-bounds?brandId=${brandId}` : null,
    fetcher
  );

  // When campaigns load (or selection changes), default dates to the campaign window
  useEffect(() => {
    if (!campaigns.length || allCampaigns) return;
    const first = campaigns[0];
    setCampaignId(first.id);
    if (!initialFrom) setFrom(first.start_date?.slice(0, 10) ?? "");
    if (!initialTo) setTo(first.end_date?.slice(0, 10) ?? "");
  }, [campaigns]); // eslint-disable-line

  // When "All campaigns" is toggled on and date bounds are loaded
  useEffect(() => {
    if (allCampaigns && dateBounds) {
      if (dateBounds.min) setFrom(dateBounds.min);
      if (dateBounds.max) setTo(dateBounds.max);
      setCampaignId(null); // Clear campaign selection in "All campaigns" mode
    }
  }, [allCampaigns, dateBounds]);

  // Notify parent whenever inputs change
  useEffect(() => {
    if (from && to) onChange({ campaignId: allCampaigns ? null : campaignId, from, to });
  }, [campaignId, from, to, allCampaigns]); // eslint-disable-line

  const selected = useMemo(
    () => campaigns.find(c => c.id === campaignId) ?? null,
    [campaignId, campaigns]
  );

  if (isLoading) return <div className="mb-6 text-sm text-slate-500">Loading campaigns…</div>;
  if (error || !campaigns.length)
    return <div className="mb-6 text-sm text-red-600">No campaigns found.</div>;

  return (
    <div className="mb-6 flex flex-col gap-3">
      {/* All Campaigns Toggle */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="all-campaigns-toggle"
          checked={allCampaigns}
          onChange={(e) => {
            const checked = e.target.checked;
            setAllCampaigns(checked);
            if (!checked) {
              // When disabling "All campaigns", restore first campaign
              const first = campaigns[0];
              setCampaignId(first.id);
              setFrom(first.start_date?.slice(0, 10) ?? "");
              setTo(first.end_date?.slice(0, 10) ?? "");
            }
          }}
          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
        <label 
          htmlFor="all-campaigns-toggle" 
          className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer select-none"
        >
          All campaigns
        </label>
      </div>

      {/* Campaign and Date Controls */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <div className="flex-1">
          <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Campaign</label>
          <select
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2 disabled:opacity-50 disabled:cursor-not-allowed"
            value={campaignId ?? ""}
            disabled={allCampaigns}
            onChange={(e) => {
              const id = e.target.value;
              setCampaignId(id);
              const c = campaigns.find(x => x.id === id);
              if (c) {
                setFrom((c.start_date ?? "").slice(0, 10));
                setTo((c.end_date ?? "").slice(0, 10));
              }
            }}
          >
            {campaigns.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {selected && !allCampaigns && (
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {selected.start_date?.slice(0,10)} → {selected.end_date?.slice(0,10)}
            </div>
          )}
          {allCampaigns && dateBounds && (
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              All data: {dateBounds.min ?? "N/A"} → {dateBounds.max ?? "N/A"}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">From</label>
          <input
            type="date"
            className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">To</label>
          <input
            type="date"
            className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}