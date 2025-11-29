/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutGrid, Megaphone, Users, Settings, FlaskConical } from "lucide-react";
import type { Route } from "next";
import { isDemoSearchParam, appendDemoParam } from "@/lib/demo-mode";

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(true);

  // Check if we're in demo mode
  const isDemo = isDemoSearchParam(
    Object.fromEntries(searchParams.entries())
  );

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("tf-sidebar") : null;
    if (saved) setOpen(saved === "open");
  }, []);

  function toggle() {
    const next = !open;
    setOpen(next);
    localStorage.setItem("tf-sidebar", next ? "open" : "closed");
  }

  // Navigation items - demo param will be appended when in demo mode
  const nav = [
    { href: "/overview", label: "Overview", icon: LayoutGrid },
    { href: "/campaigns", label: "Campaigns", icon: Megaphone },
    { href: "/influencers", label: "Influencers", icon: Users },
    { href: "/analytics", label: "Analytics", icon: LayoutGrid },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside
      className={`h-full border-r border-slate-200/60 bg-white dark:border-slate-800/60 dark:bg-slate-950 transition-all ${
        open ? "w-60" : "w-14"
      }`}
      aria-label="Primary"
    >
      <div className="flex h-14 items-center justify-between px-3">
        <button
          type="button"
          onClick={toggle}
          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-indigo-400"
          aria-expanded={open}
          aria-controls="sidebar-nav"
        >
          {open ? "Collapse" : "Open"}
        </button>

        {/* Demo indicator in sidebar */}
        {isDemo && open && (
          <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-500">
            <FlaskConical className="h-3 w-3" />
            Demo
          </span>
        )}
      </div>

      <nav id="sidebar-nav" className="mt-2 space-y-1 px-2">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = pathname?.startsWith(item.href);
          // Append demo param if in demo mode
          const href = appendDemoParam(item.href, isDemo);

          return (
            <Link
              key={item.href}
              href={href as Route}
              className={`group flex items-center gap-3 rounded-md px-2 py-2 text-sm transition ${
                active
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
              aria-current={active ? "page" : undefined}
              title={open ? undefined : item.label}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {open ? <span className="truncate">{item.label}</span> : null}
            </Link>
          );
        })}
      </nav>

      {/* Try Demo Link when not in demo mode */}
      {!isDemo && open && (
        <div className="mt-6 px-2">
          <Link
            href="/overview?demo=1"
            className="flex items-center gap-2 rounded-md border border-dashed border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs text-amber-600 transition hover:bg-amber-500/10 dark:text-amber-400"
          >
            <FlaskConical className="h-3.5 w-3.5" />
            <span>Try demo mode</span>
          </Link>
        </div>
      )}
    </aside>
  );
}
