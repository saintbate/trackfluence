"use client";

import { useTransition } from "react";
import { refreshInstagram } from "@/app/(dashboard)/actions/instagram";

export default function RefreshInstagramButton({
  brandId,
  from,
  to,
}: {
  brandId?: string | null;
  from?: string | null;
  to?: string | null;
}) {
  const [isPending, startTransition] = useTransition();

  const disabled =
    !brandId || !from || !to || isPending;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        startTransition(async () => {
          if (!brandId || !from || !to) return;

          const res = await refreshInstagram(brandId, from, to);

          alert(
            `Refreshed IG: daily=${res.saved.daily}, media=${res.saved.media}`
          );
        });
      }}
      className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
      aria-live="polite"
    >
      {isPending ? "Refreshing…" : "Refresh IG"}
    </button>
  );
}