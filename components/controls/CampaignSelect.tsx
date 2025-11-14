/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState, useTransition, type ChangeEventHandler } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/client";
import { GA_ENABLED, track } from "@/lib/ga";

type CampaignOption = {
  id: string;
  name: string;
};

type CampaignSelectProps = {
  brandId?: string | null;
  initialCampaignId?: string | null;
  onLoadingChange?: (loading: boolean) => void;
};

export default function CampaignSelect({ brandId, initialCampaignId, onLoadingChange }: CampaignSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [campaigns, setCampaigns] = useState<CampaignOption[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState(initialCampaignId ?? "");
  const [isNavigating, startTransition] = useTransition();

  useEffect(() => {
    onLoadingChange?.(isNavigating);
  }, [isNavigating, onLoadingChange]);

  useEffect(() => {
    setValue(initialCampaignId ?? "");
  }, [initialCampaignId]);

  useEffect(() => {
    if (!brandId) {
      setCampaigns([]);
      setError(null);
      return;
    }

    let cancelled = false;
    const client = createBrowserClient();

    async function loadCampaigns() {
      setCampaigns(null);
      setError(null);
      try {
        const { data, error: queryError } = await client
          .from("campaign")
          .select("id, name")
          .eq("brand_id", String(brandId))
          .order("created_at", { ascending: false });

        if (cancelled) return;

        if (queryError) {
          console.error("[CampaignSelect] failed to load campaigns", queryError);
          setError("Unable to load campaigns");
          setCampaigns([]);
          return;
        }

        setCampaigns((data ?? []).map((row) => ({ id: row.id, name: row.name })));
      } catch (err) {
        if (cancelled) return;
        console.error("[CampaignSelect] unexpected error", err);
        setError("Unable to load campaigns");
        setCampaigns([]);
      }
    }

    loadCampaigns();

    return () => {
      cancelled = true;
    };
  }, [brandId]);

  const options = useMemo(() => campaigns ?? [], [campaigns]);

  const handleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const nextCampaign = event.target.value;
    setValue(nextCampaign);

    const params = new URLSearchParams(searchParams?.toString() ?? "");
    const dateFrom = params.get("dateFrom");
    const dateTo = params.get("dateTo");
    params.delete("page");
    params.delete("campaignId");
    const qs = new URLSearchParams();
    if (dateFrom) qs.set("dateFrom", dateFrom);
    if (dateTo) qs.set("dateTo", dateTo);
    const href = nextCampaign ? `/campaign/${nextCampaign}${qs.toString() ? `?${qs.toString()}` : ""}` : (qs.toString() ? `${pathname.split("?")[0]}?${qs.toString()}` : pathname.split("?")[0]);
    startTransition(() => router.push(href));

    if (GA_ENABLED) {
      try {
        const selected = options.find((c) => c.id === nextCampaign);
        if (nextCampaign) {
          void track("campaign_selected", {
            campaign_id: nextCampaign,
            campaign_name: selected?.name,
          });
        }
      } catch {}
    }
  };
  const clear = () => {
    setValue("");
    const nextParams = new URLSearchParams(searchParams?.toString() ?? "");
    nextParams.delete("campaignId");
    nextParams.set("page", "1");
    const queryString = nextParams.toString();
    const href = queryString ? `${pathname}?${queryString}` : pathname;
    startTransition(() => {
      router.push(href);
    });
  };

  let control: React.ReactNode;

  if (!brandId) {
    control = (
      <div className="rounded-md border border-slate-200/60 bg-white px-3 py-2 text-sm text-slate-500 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/80 dark:text-slate-400">
        Select a brand to filter campaigns.
      </div>
    );
  } else if (error) {
    control = (
      <div className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-600 dark:border-amber-400/30 dark:bg-amber-500/5 dark:text-amber-300">
        {error}
      </div>
    );
  } else if (campaigns === null) {
    control = (
      <div className="rounded-md border border-slate-200/60 bg-white px-3 py-2 text-sm text-slate-500 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/80 dark:text-slate-400">
        Loading campaigns…
      </div>
    );
  } else if (options.length === 0) {
    control = (
      <div className="rounded-md border border-slate-200/60 bg-white px-3 py-2 text-sm text-slate-500 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/80 dark:text-slate-400">
        No campaigns yet — showing all activity.
      </div>
    );
  } else {
    control = (
      <div className="flex items-center gap-2">
        <select
          value={value}
          onChange={handleChange}
          className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-100 shadow-sm transition hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-100"
        >
          <option value="">All Campaigns</option>
          {options.map((campaign) => (
            <option key={campaign.id} value={campaign.id}>
              {campaign.name}
            </option>
          ))}
        </select>
        {value ? (
          <button
            type="button"
            onClick={clear}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-indigo-400"
            aria-label="Clear campaign filter"
          >
            Clear
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex min-w-[14rem] flex-col gap-1 text-xs">
      <span className="font-medium text-slate-600 dark:text-slate-300">Campaign</span>
      {control}
    </div>
  );
}
