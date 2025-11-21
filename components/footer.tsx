"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const MARKETING_PATHS = [
  "/",
  "/product",
  "/how-it-works",
  "/about",
  "/terms",
  "/privacy",
];

export default function Footer() {
  const pathname = usePathname();

  const isMarketingRoute = MARKETING_PATHS.includes(pathname);

  if (!isMarketingRoute) {
    return null;
  }

  return (
    <footer className="border-t border-white/5 bg-black/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3 max-w-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 via-cyan-400 to-blue-600 text-sm font-bold text-black shadow-lg shadow-sky-500/40">
              T
            </div>
            <span className="text-sm font-semibold tracking-tight text-slate-50 sm:text-base">
              Trackfluence
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Influencer analytics for TikTok-native brands and agencies. Track
            every creator, prove every campaign.
          </p>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Trackfluence. All rights reserved.
          </p>
        </div>

        <div className="grid flex-1 gap-8 text-sm text-slate-300 sm:grid-cols-3">
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Product
            </h3>
            <ul className="space-y-1.5">
              <li>
                <Link href="/product" className="hover:text-white">
                  Overview
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-white">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Dashboard
            </h3>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="https://app.trackfluence.app"
                  className="hover:text-white"
                >
                  Go to Dashboard
                </a>
              </li>
              <li>
                <a
                  href="https://app.trackfluence.app/login"
                  className="hover:text-white"
                >
                  Log in
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Company
            </h3>
            <ul className="space-y-1.5">
              <li>
                <Link href="/about" className="hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}


