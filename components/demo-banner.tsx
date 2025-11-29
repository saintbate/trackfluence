// components/demo-banner.tsx
"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { FlaskConical, X } from "lucide-react";
import { removeDemoParam } from "@/lib/demo-mode";
import type { Route } from "next";

type DemoBannerProps = {
  isDemo: boolean;
};

/**
 * A subtle banner shown when Demo Mode is active.
 * Renders null when not in demo mode.
 * Includes an "Exit Demo" button to return to live data.
 */
export default function DemoBanner({ isDemo }: DemoBannerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!isDemo) return null;

  const handleExitDemo = () => {
    // Build the current URL without demo param
    const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    const cleanUrl = removeDemoParam(currentUrl);
    router.replace(cleanUrl as Route);
  };

  return (
    <div className="flex items-center justify-center gap-3 rounded-full border border-amber-500/30 bg-amber-950/40 px-4 py-2 text-xs text-amber-200">
      <FlaskConical className="h-3.5 w-3.5 text-amber-400" />
      <span>
        <span className="font-semibold">Demo Mode</span>
        <span className="hidden sm:inline">
          {" "}— You&apos;re viewing sample data.{" "}
          <a
            href="/settings/accounts"
            className="underline underline-offset-2 hover:text-amber-100"
          >
            Connect TikTok
          </a>{" "}
          to see your own campaigns.
        </span>
      </span>
      <button
        onClick={handleExitDemo}
        className="ml-1 flex items-center gap-1 rounded-full bg-amber-800/50 px-2 py-0.5 text-[10px] font-medium text-amber-100 transition hover:bg-amber-800/70"
        title="Exit demo mode"
      >
        <X className="h-3 w-3" />
        <span className="hidden sm:inline">Exit</span>
      </button>
    </div>
  );
}
