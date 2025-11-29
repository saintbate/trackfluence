/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Link from "next/link";
import { FlaskConical } from "lucide-react";
import type { Route } from "next";
import EmptyRevenue from "@/components/illustrations/EmptyRevenue";
import EmptyInfluencers from "@/components/illustrations/EmptyInfluencers";

type Variant = "pick-brand" | "no-data" | "no-influencers" | "no-tiktok";

type Props =
  | {
      title?: string;
      hint?: string;
      actionLabel?: string;
      onAction?: () => void;
      actionHref?: string;
      illustration?: React.ReactNode;
      showDemoLink?: boolean;
      variant?: never;
    }
  | {
      variant: Variant;
      title?: string;
      hint?: string;
      actionLabel?: string;
      onAction?: () => void;
      actionHref?: string;
      illustration?: React.ReactNode;
      showDemoLink?: boolean;
    };

export default function Empty(props: Props) {
  const { variant } = props as { variant?: Variant };

  let defaultTitle = "";
  let defaultHint = "";
  let defaultIllustration: React.ReactNode = null;
  let defaultShowDemoLink = false;

  switch (variant) {
    case "pick-brand":
      defaultTitle = "Pick a brand";
      defaultHint = "Select a brand to view KPIs and insights.";
      defaultIllustration = <EmptyRevenue />;
      break;
    case "no-data":
      defaultTitle = "No data in this date range";
      defaultHint = "Try expanding the range or selecting a different campaign.";
      defaultIllustration = <EmptyRevenue />;
      defaultShowDemoLink = true;
      break;
    case "no-influencers":
      defaultTitle = "No influencers yet";
      defaultHint = "When influencers start driving revenue, they will appear here.";
      defaultIllustration = <EmptyInfluencers />;
      defaultShowDemoLink = true;
      break;
    case "no-tiktok":
      defaultTitle = "Connect TikTok to get started";
      defaultHint = "Link your TikTok Business account to see creator performance data.";
      defaultIllustration = <EmptyRevenue />;
      defaultShowDemoLink = true;
      break;
    default:
      break;
  }

  const title = (props as any).title ?? defaultTitle;
  const hint = (props as any).hint ?? defaultHint;
  const illustration = (props as any).illustration ?? defaultIllustration;
  const actionLabel = (props as any).actionLabel as string | undefined;
  const onAction = (props as any).onAction as (() => void) | undefined;
  const actionHref = (props as any).actionHref as string | undefined;
  const showDemoLink = (props as any).showDemoLink ?? defaultShowDemoLink;

  return (
    <div className="mx-auto max-w-md rounded-xl border border-white/10 p-6 text-center">
      <div className="mb-3 flex justify-center">{illustration}</div>
      {title ? (
        <div className="mb-1 text-base font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </div>
      ) : null}
      {hint ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">{hint}</p>
      ) : null}

      {/* Primary action */}
      {actionLabel && (onAction || actionHref) ? (
        <div className="mt-4">
          {actionHref ? (
            <Link
              href={actionHref as Route}
              className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-indigo-400"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onAction}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-indigo-400"
            >
              {actionLabel}
            </button>
          )}
        </div>
      ) : null}

      {/* Demo mode link */}
      {showDemoLink && (
        <div className="mt-4 border-t border-slate-200/50 pt-4 dark:border-slate-700/50">
          <Link
            href="/overview?demo=1"
            className="inline-flex items-center gap-1.5 text-xs text-amber-600 transition hover:text-amber-500 dark:text-amber-400 dark:hover:text-amber-300"
          >
            <FlaskConical className="h-3.5 w-3.5" />
            <span>Explore a live demo with sample data</span>
          </Link>
        </div>
      )}
    </div>
  );
}
