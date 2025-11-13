"use client";

import React from "react";
import EmptyRevenue from "@/components/illustrations/EmptyRevenue";
import EmptyInfluencers from "@/components/illustrations/EmptyInfluencers";

type Variant = "pick-brand" | "no-data" | "no-influencers";

type Props =
  | {
      title?: string;
      hint?: string;
      actionLabel?: string;
      onAction?: () => void;
      illustration?: React.ReactNode;
      variant?: never;
    }
  | {
      variant: Variant;
      title?: string;
      hint?: string;
      actionLabel?: string;
      onAction?: () => void;
      illustration?: React.ReactNode;
    };

export default function Empty(props: Props) {
  const { variant } = props as { variant?: Variant };

  let defaultTitle = "";
  let defaultHint = "";
  let defaultIllustration: React.ReactNode = null;

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
      break;
    case "no-influencers":
      defaultTitle = "No influencers yet";
      defaultHint = "When influencers start driving revenue, they will appear here.";
      defaultIllustration = <EmptyInfluencers />;
      break;
    default:
      break;
  }

  const title = (props as any).title ?? defaultTitle;
  const hint = (props as any).hint ?? defaultHint;
  const illustration = (props as any).illustration ?? defaultIllustration;
  const actionLabel = (props as any).actionLabel as string | undefined;
  const onAction = (props as any).onAction as (() => void) | undefined;

  return (
    <div className="mx-auto max-w-md rounded-xl border border-white/10 p-6 text-center">
      <div className="mb-3 flex justify-center">{illustration}</div>
      {title ? (
        <div className="mb-1 text-base font-semibold text-slate-900 dark:text-slate-100">{title}</div>
      ) : null}
      {hint ? <p className="text-sm text-slate-500 dark:text-slate-400">{hint}</p> : null}
      {actionLabel && onAction ? (
        <div className="mt-4">
          <button
            type="button"
            onClick={onAction}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-indigo-400"
          >
            {actionLabel}
          </button>
        </div>
      ) : null}
    </div>
  );
}


