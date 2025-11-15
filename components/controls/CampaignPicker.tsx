// components/controls/CampaignPicker.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import type { Route } from "next";
type Campaign = { id: string; name: string };

export default function CampaignPicker({
  campaigns,
  paramKey = "campaignId",
  label = "Campaign",
}: {
  campaigns: Campaign[];
  /** querystring key to write chosen id to */
  paramKey?: string;
  label?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const qs = useSearchParams();

  const value = qs.get(paramKey) ?? "";

  const opts = useMemo(
    () =>
      campaigns.map((c) => ({
        value: c.id,
        label: c.name || c.id,
      })),
    [campaigns]
  );

  function setParam(next: string) {
    const q = new URLSearchParams(qs.toString());
    if (!next) q.delete(paramKey);
    else q.set(paramKey, next);
    const href = `${pathname}?${q.toString()}`;
    router.replace(href as Route);
  }

  return (
    <div className="flex min-w-[14rem] flex-col gap-1 text-xs">
      <span className="font-medium text-slate-600 dark:text-slate-300">{label}</span>
      <select
        className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-100 shadow-sm transition hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-100"
        value={value}
        onChange={(e) => setParam(e.target.value)}
      >
        <option value="">All Campaigns</option>
        {opts.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}