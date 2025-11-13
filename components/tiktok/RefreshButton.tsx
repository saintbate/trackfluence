"use client";

import { useTransition } from "react";
import { refreshTikTok } from "@/app/(dashboard)/actions/tiktok";

export default function RefreshTikTokButton({ brandId, from, to }: { brandId?: string | null; from?: string | null; to?: string | null }) {
  const [isPending, startTransition] = useTransition();
  const disabled = !brandId || !from || !to || isPending;
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() =>
        startTransition(async () => {
          if (!brandId || !from || !to) return;
          const res = await refreshTikTok(brandId, from, to);
          alert(`Refreshed TikTok: daily=${res.saved.daily}, media=${res.saved.media}`);
        })
      }
      className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      aria-live="polite"
      title={disabled ? "Select brand and date range to refresh TikTok" : "Refresh TikTok data"}
    >
      {isPending ? "Refreshing…" : "Refresh TikTok"}
    </button>
  );
}


