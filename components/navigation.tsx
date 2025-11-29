"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MARKETING_PATHS = [
  "/",
  "/product",
  "/how-it-works",
  "/pricing",
  "/about",
  "/terms",
  "/privacy",
];

export default function Navigation() {
  const pathname = usePathname();

  const isMarketingRoute = MARKETING_PATHS.includes(pathname);

  if (!isMarketingRoute) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-black/65 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 via-cyan-400 to-blue-600 text-sm font-bold text-black shadow-lg shadow-sky-500/40">
            T
          </div>
          <span className="text-sm font-semibold tracking-tight text-slate-50 sm:text-base">
            Trackfluence
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <Link
            href="/product"
            className="hover:text-white transition-colors"
          >
            Product
          </Link>
          <Link
            href="/how-it-works"
            className="hover:text-white transition-colors"
          >
            How it works
          </Link>
          <Link href="/pricing" className="hover:text-white transition-colors">
            Pricing
          </Link>
          <Link
            href="/about"
            className="hover:text-white transition-colors"
          >
            About
          </Link>
        </nav>

        {/* Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="https://app.trackfluence.app/login"
            className="text-sm text-slate-300 hover:text-white"
          >
            Log in
          </a>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-400 focus-visible:ring-offset-black/5 whitespace-nowrap bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-500 text-black shadow-[0_0_30px_rgba(56,189,248,0.45)] hover:from-sky-400 hover:via-cyan-300 hover:to-blue-400"
          >
            Get Access
          </Link>
        </div>

        {/* Mobile menu (simple) */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href="https://app.trackfluence.app/login"
            className="text-xs font-medium text-slate-300 hover:text-white"
          >
            Log in
          </a>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-400 focus-visible:ring-offset-black/5 whitespace-nowrap bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-500 text-black shadow-[0_0_30px_rgba(56,189,248,0.45)] hover:from-sky-400 hover:via-cyan-300 hover:to-blue-400"
          >
            Get Access
          </Link>
        </div>
      </div>
    </header>
  );
}


