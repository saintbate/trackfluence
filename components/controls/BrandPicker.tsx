"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { GA_ENABLED, trackEvent } from "@/lib/ga";
import { useSetBrand } from "@/components/providers/BrandContext";

export type BrandPickerProps = {
  initialBrandId?: string;
  onLoadingChange?: (loading: boolean) => void;
};

type BrandSummary = {
  id: string;
  name: string;
};

type BrandApiResponse = {
  ok: boolean;
  brands: BrandSummary[];
};

export default function BrandPicker({ initialBrandId, onLoadingChange }: BrandPickerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setBrand = useSetBrand();
  const [brands, setBrands] = useState<BrandSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState(initialBrandId ?? "");
  const [isNavigating, startTransition] = useTransition();

  useEffect(() => {
    onLoadingChange?.(isNavigating);
  }, [isNavigating, onLoadingChange]);

  useEffect(() => {
    setValue(initialBrandId ?? "");
  }, [initialBrandId]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/api/debug/brand", { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Failed to load brands (${response.status})`);
        }
        const payload: BrandApiResponse = await response.json();
        if (cancelled) return;
        if (!payload.ok) {
          setError("Unable to load brands");
          setBrands(payload.brands ?? []);
          return;
        }
        setBrands(payload.brands ?? []);
      } catch (_err) {
        console.error("[BrandPicker] load brands", _err);
        if (!cancelled) {
          setError("Unable to load brands");
          setBrands([]);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const options = useMemo(() => brands ?? [], [brands]);

  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    const nextBrand = event.target.value;
    setValue(nextBrand);
    const selected = options.find((b) => b.id === nextBrand);

    const nextParams = new URLSearchParams(searchParams?.toString() ?? "");

    if (nextBrand) {
      nextParams.set("brandId", nextBrand);
    } else {
      nextParams.delete("brandId");
    }

    // Reset page when brand changes
    nextParams.delete("page");

    const queryString = nextParams.toString();
    const href = queryString ? `${pathname}?${queryString}` : pathname;

    startTransition(() => {
      router.replace(href as any);
    });

    // Analytics (guarded)
    if (GA_ENABLED) {
      try {
        if (nextBrand && selected?.name) {
          void trackEvent("brand_selected", {
            brand_id: nextBrand,
            brand_name: selected.name,
            source: "BrandPicker",
            env: undefined,
            app_version: undefined,
          });
        }
      } catch {
        // no-op
      }
    }

    // Update BrandContext cookie for subsequent events
    if (nextBrand && selected?.name) {
      setBrand({ brandId: nextBrand, brandName: selected.name });
    }
  };

  let control: React.ReactNode;

  if (error) {
    control = (
      <div className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-600 dark:border-amber-400/30 dark:bg-amber-500/5 dark:text-amber-300">
        {error}
      </div>
    );
  } else if (brands === null) {
    control = (
      <div className="rounded-md border border-slate-200/60 bg-white px-3 py-2 text-sm text-slate-500 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/80 dark:text-slate-400">
        Loading brands…
      </div>
    );
  } else if (options.length === 0) {
    control = (
      <div className="rounded-md border border-slate-200/60 bg-white px-3 py-2 text-sm text-slate-500 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/80 dark:text-slate-400">
        No brands yet — create one on the Brands page.
      </div>
    );
  } else {
    control = (
      <select
        value={value}
        onChange={handleChange}
        className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-100 shadow-sm transition hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-100"
      >
        <option value="" disabled>
          Select a brand
        </option>
        {options.map((brand) => (
          <option key={brand.id} value={brand.id}>
            {brand.name}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className="flex min-w-[12rem] flex-col gap-1 text-xs">
      <span className="font-medium text-slate-600 dark:text-slate-300">Brand</span>
      {control}
    </div>
  );
}