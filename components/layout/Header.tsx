/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { FlaskConical } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { isDemoSearchParam } from "@/lib/demo-mode";

export default function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [title, setTitle] = useState("Dashboard");

  // Check if we're in demo mode
  const isDemo = isDemoSearchParam(
    Object.fromEntries(searchParams.entries())
  );

  // ✅ Sync <h1> with data-page-title on the page
  useEffect(() => {
    const el = document.querySelector<HTMLElement>("[data-page-title]");
    if (el?.textContent) setTitle(el.textContent);
  }, [pathname]);

  // ✅ Extract Date Range Label
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  const dateLabel = useMemo(() => {
    if (!dateFrom && !dateTo) return "";

    const formatDate = (d: string | null) => {
      if (!d) return "";
      try {
        return new Date(d).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      } catch {
        return "";
      }
    };

    const from = formatDate(dateFrom);
    const to = formatDate(dateTo);

    if (from && to) return `${from} → ${to}`;
    if (from && !to) return `${from}`;
    if (!from && to) return `${to}`;
    return "";
  }, [dateFrom, dateTo]);

  return (
    <header className="flex items-center justify-between py-4 mb-4 px-6">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">{title}</h1>
          {isDemo && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-500">
              <FlaskConical className="h-3 w-3" />
              Demo
            </span>
          )}
        </div>
        {dateLabel && (
          <p className="text-sm text-muted-foreground">{dateLabel}</p>
        )}
      </div>

      {/* ✅ Working Theme Toggle */}
      <ThemeToggle />
    </header>
  );
}
