// components/controls/SpendInput.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef } from "react";

function useDebounced(fn: (...a: any[]) => void, ms = 400) {
  const t = useRef<number | undefined>(undefined);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback((...args: any[]) => {
    if (t.current) window.clearTimeout(t.current);
    t.current = window.setTimeout(() => fn(...args), ms);
  }, [fn, ms]);
}

export default function SpendInput({
  paramKey = "spend",
  label = "Ad Spend ($)",
  min = 0,
  step = 1,
}: {
  /** querystring key to write spend to */
  paramKey?: string;
  label?: string;
  min?: number;
  step?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const qs = useSearchParams();

  const value = useMemo(() => {
    const raw = qs.get(paramKey);
    return raw ? Number(raw) : "";
  }, [qs, paramKey]);

  const update = useDebounced((n: number | "") => {
    const q = new URLSearchParams(qs.toString());
    if (n === "" || Number.isNaN(n)) q.delete(paramKey);
    else q.set(paramKey, String(n));
    router.replace(`${pathname}?${q.toString()}`);
  });

  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="text-slate-400">{label}</span>
      <input
        type="number"
        inputMode="decimal"
        min={min}
        step={step}
        defaultValue={value as number | undefined}
        onChange={(e) => {
          const n = e.target.value === "" ? "" : Number(e.target.value);
          update(n);
        }}
        placeholder="0"
        className="w-28 rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-right text-slate-100"
      />
    </label>
  );
}