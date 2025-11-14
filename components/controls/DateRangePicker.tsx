/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { GA_ENABLED, track } from "@/lib/ga";

type DateRangePickerProps = {
  initialFrom?: string;
  initialTo?: string;
  onLoadingChange?: (loading: boolean) => void;
};

type PresetKey = "7d" | "30d" | "month" | "all";

type Preset = {
  key: PresetKey;
  label: string;
  range: {
    from?: string;
    to?: string;
  };
};

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(base: Date, offset: number): Date {
  const next = new Date(base);
  next.setDate(base.getDate() + offset);
  return next;
}

function normaliseDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export default function DateRangePicker({ initialFrom, initialTo, onLoadingChange }: DateRangePickerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, startTransition] = useTransition();
  const [fromValue, setFromValue] = useState(initialFrom ?? "");
  const [toValue, setToValue] = useState(initialTo ?? "");

  useEffect(() => {
    onLoadingChange?.(isNavigating);
  }, [isNavigating, onLoadingChange]);

  useEffect(() => {
    const nextFrom = searchParams?.get("dateFrom") ?? "";
    const nextTo = searchParams?.get("dateTo") ?? "";
    setFromValue(nextFrom);
    setToValue(nextTo);
  }, [searchParams]);

  const today = useMemo(() => normaliseDay(new Date()), []);

  const presets = useMemo<Preset[]>(() => {
    const last7From = formatDate(addDays(today, -6));
    const last30From = formatDate(addDays(today, -29));
    const thisMonthStart = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
    const todayFormatted = formatDate(today);

    return [
      {
        key: "7d" as const,
        label: "Last 7 days",
        range: { from: last7From, to: todayFormatted },
      },
      {
        key: "30d" as const,
        label: "Last 30 days",
        range: { from: last30From, to: todayFormatted },
      },
      {
        key: "month" as const,
        label: "This month",
        range: { from: thisMonthStart, to: todayFormatted },
      },
      {
        key: "all" as const,
        label: "All time",
        range: { from: undefined, to: undefined },
      },
    ];
  }, [today]);

  const activePreset = useMemo<PresetKey | null>(() => {
    const currentFrom = fromValue ?? "";
    const currentTo = toValue ?? "";

    for (const preset of presets) {
      const presetFrom = preset.range.from ?? "";
      const presetTo = preset.range.to ?? "";
      if (presetFrom === currentFrom && presetTo === currentTo) {
        return preset.key;
      }
    }
    return null;
  }, [fromValue, presets, toValue]);

  const commitRange = useCallback(
    (next: { from?: string; to?: string }) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");

      if (next.from) {
        params.set("dateFrom", next.from);
      } else {
        params.delete("dateFrom");
      }

      if (next.to) {
        params.set("dateTo", next.to);
      } else {
        params.delete("dateTo");
      }

      params.set("page", "1");

      const queryString = params.toString();
      const href = queryString ? `${pathname}?${queryString}` : pathname;

      startTransition(() => {
        router.push(href);
      });
    },
    [pathname, router, searchParams, startTransition]
  );

  const handlePresetClick = useCallback(
    (preset: Preset) => {
      setFromValue(preset.range.from ?? "");
      setToValue(preset.range.to ?? "");
      commitRange(preset.range);
      if (GA_ENABLED) {
        try {
          void track("date_range_changed", {
            from: preset.range.from,
            to: preset.range.to,
            preset: preset.key,
          });
        } catch {}
      }
    },
    [commitRange]
  );

  const handleFromChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const nextFrom = event.target.value;
      let nextTo = toValue;

      if (nextFrom && nextTo && nextFrom > nextTo) {
        nextTo = nextFrom;
        setToValue(nextTo);
      }

      setFromValue(nextFrom);
      commitRange({ from: nextFrom || undefined, to: nextTo || undefined });
      if (GA_ENABLED) {
        try {
          void track("date_range_changed", {
            from: nextFrom || undefined,
            to: nextTo || undefined,
          });
        } catch {}
      }
    },
    [commitRange, toValue]
  );

  const handleToChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const nextTo = event.target.value;
      let nextFrom = fromValue;

      if (nextTo && nextFrom && nextTo < nextFrom) {
        nextFrom = nextTo;
        setFromValue(nextFrom);
      }

      setToValue(nextTo);
      commitRange({ from: nextFrom || undefined, to: nextTo || undefined });
      if (GA_ENABLED) {
        try {
          void track("date_range_changed", {
            from: nextFrom || undefined,
            to: nextTo || undefined,
          });
        } catch {}
      }
    },
    [commitRange, fromValue]
  );

  return (
    <div className="flex min-w-[16rem] flex-col gap-2 text-xs">
      <span className="font-medium text-slate-600 dark:text-slate-300">Date range</span>
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex overflow-hidden rounded-md border border-white/10 bg-black/20 text-xs shadow-sm dark:border-white/10 dark:bg-slate-900/50" role="group" aria-label="Quick date presets">
          {presets.map((preset) => {
            const isActive = activePreset === preset.key;
            return (
              <button
                key={preset.key}
                type="button"
                onClick={() => handlePresetClick(preset)}
                aria-pressed={isActive}
                className={`px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isActive ? "bg-blue-600 text-white" : "text-slate-200 hover:bg-white/10"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <label className="flex flex-col gap-1">
            <span className="sr-only">Start date</span>
            <input
              type="date"
              value={fromValue}
              onChange={handleFromChange}
              className="rounded-md border border-white/10 bg-black/20 px-2 py-1.5 text-sm text-slate-100 shadow-sm transition hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-100"
            />
          </label>
          <span className="text-slate-400">–</span>
          <label className="flex flex-col gap-1">
            <span className="sr-only">End date</span>
            <input
              type="date"
              value={toValue}
              onChange={handleToChange}
              className="rounded-md border border-white/10 bg-black/20 px-2 py-1.5 text-sm text-slate-100 shadow-sm transition hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-100"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
