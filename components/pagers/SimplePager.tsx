"use client";

import * as React from "react";
import { useEffect, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SimplePagerProps = {
  page: number;
  pageSize: number;
  total: number;
  onLoadingChange?: (loading: boolean) => void;
};

export default function SimplePager({ page, pageSize, total, onLoadingChange }: SimplePagerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, startTransition] = useTransition();
  const [announce, setAnnounce] = React.useState("");

  useEffect(() => {
    onLoadingChange?.(isNavigating);
  }, [isNavigating, onLoadingChange]);

  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safePageSize = Math.max(pageSize, 1);
  const totalPages = Math.max(Math.ceil(total / safePageSize), 1);

  const goToPage = (nextPage: number) => {
    const clamped = Math.min(Math.max(nextPage, 1), totalPages);
    if (clamped === safePage) return;

    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("page", clamped.toString());

    const queryString = params.toString();
    const href = queryString ? `${pathname}?${queryString}` : pathname;

    startTransition(() => {
      router.push(href);
    });
    setAnnounce(`Page ${clamped} of ${totalPages}`);
    setTimeout(() => setAnnounce(""), 500);
  };

  const hasPrev = safePage > 1;
  const hasNext = safePage < totalPages;

  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-slate-200/60 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/80 dark:text-slate-300" role="navigation" aria-label="Pagination">
      <span className="sr-only" aria-live="polite">{announce}</span>
      <button
        type="button"
        onClick={() => goToPage(safePage - 1)}
        disabled={!hasPrev}
        className="rounded-md border border-transparent px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400"
        aria-label="Previous page"
      >
        Prev
      </button>
      <span className="text-xs text-slate-500 dark:text-slate-400">
        Page {safePage} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => goToPage(safePage + 1)}
        disabled={!hasNext}
        className="rounded-md border border-transparent px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400"
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
}
