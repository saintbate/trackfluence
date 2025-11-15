// components/layout/DashboardShell.tsx
"use client";

import { ReactNode } from "react";
import { BarChart3, Layers, LineChart, Settings } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";

export default function DashboardShell({ title, right, children }: {
  title: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-white/10 bg-zinc-950/50">
          <div className="px-5 py-4 text-lg font-semibold">Trackfluence</div>
          <nav className="px-2 py-2 space-y-1 text-sm">
            <SidebarLink href="/overview" icon={<BarChart3 className="h-4 w-4" />}>Overview</SidebarLink>
            <SidebarLink href="/campaigns" icon={<Layers className="h-4 w-4" />}>Campaigns</SidebarLink>
            <SidebarLink href="/analytics" icon={<LineChart className="h-4 w-4" />}>Analytics</SidebarLink>
            <SidebarLink href="/settings" icon={<Settings className="h-4 w-4" />}>Settings</SidebarLink>
          </nav>
          <div className="mt-auto p-4 text-[11px] text-white/40">
            © {new Date().getFullYear()} Trackfluence
          </div>
        </aside>

        {/* Main column */}
        <div className="flex-1">
          {/* Top bar */}
          <header className="sticky top-0 z-30 border-b border-white/10 bg-zinc-950/50 backdrop-blur">
            <div className="flex items-center justify-between px-4 py-3">
              <h1 className="text-xl font-semibold">{title}</h1>
              <div className="flex items-center gap-3">{right}</div>
            </div>
          </header>

          {/* Content */}
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

function SidebarLink({ href, icon, children }: { href: Route; icon: ReactNode; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-md px-3 py-2 text-white/80 hover:text-white hover:bg-white/5"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}