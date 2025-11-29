// components/triage-feed.tsx

import { FlaskConical } from "lucide-react";
import type { GrowthArchitectInsight } from "@/lib/ai/growth-architect";

type TriageMode = "green" | "yellow" | "red";

type TriageItem = GrowthArchitectInsight;

type TriageFeedProps = {
  /** When provided, displays actual triage items. Otherwise shows placeholder. */
  items?: TriageItem[] | null;
  /** Whether demo mode is active */
  isDemo?: boolean;
};

const PLACEHOLDER_ITEMS: TriageItem[] = [
  {
    mode: "green",
    summary: "Scale Creator A on winning hooks.",
    reasoning:
      "Creator A holds the best ROAS and stable CPC over the last 30 days. Their latest hooks keep engagement high even as spend increases.",
    next_action:
      "Increase daily budget by ~25% on the top two ad groups and test one new creative that reuses the winning opening hook.",
  },
  {
    mode: "yellow",
    summary: "Fix drop-off on cart visitors.",
    reasoning:
      "Swipe-through and click metrics are healthy, but too few visitors reach checkout. The drop-off suggests a slow page or weak cart reminder.",
    next_action:
      'Run a simple A/B: shorten the hero copy, move the main CTA above the fold, and test a risk-reversal line like "30-day money-back guarantee."',
  },
  {
    mode: "red",
    summary: "Pause under-performing Creator C.",
    reasoning:
      "ROAS has stayed under 1.0 for 7 days in a row even after multiple creative swaps. Further spend is unlikely to recover performance.",
    next_action:
      "Pause remaining spend on this creator and re-allocate to your top two performers while you rebuild the brief and creative strategy.",
  },
];

function modeStyles(mode: TriageMode) {
  switch (mode) {
    case "green":
      return "border-emerald-500/70 bg-emerald-950/40";
    case "yellow":
      return "border-amber-400/70 bg-amber-950/40";
    case "red":
      return "border-red-500/70 bg-red-950/40";
    default:
      return "border-zinc-700/70 bg-zinc-950/40";
  }
}

export default function TriageFeed({ items, isDemo = false }: TriageFeedProps) {
  const displayItems = items ?? PLACEHOLDER_ITEMS;
  const isPlaceholder = !items;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-zinc-100">
            Triage Feed {isPlaceholder && !isDemo ? "· Preview" : ""}
          </h3>
          {isDemo && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
              <FlaskConical className="h-2.5 w-2.5" />
              Demo
            </span>
          )}
        </div>
        {isPlaceholder && !isDemo && (
          <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
            Example output
          </p>
        )}
        {isDemo && (
          <p className="text-[10px] text-amber-500/70">
            Based on sample data
          </p>
        )}
      </div>

      {displayItems.map((item, idx) => (
        <article
          key={idx}
          className={`rounded-2xl border px-4 py-3 text-sm text-zinc-100 ${modeStyles(
            item.mode
          )}`}
        >
          <p className="font-medium">{item.summary}</p>
          <p className="mt-1 text-xs text-zinc-400">{item.reasoning}</p>
          <p className="mt-2 text-xs">
            <span className="font-semibold text-emerald-300">
              Next action:{" "}
            </span>
            {item.next_action}
          </p>
        </article>
      ))}
    </section>
  );
}
