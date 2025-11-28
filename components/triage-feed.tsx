// components/triage-feed.tsx

type TriageMode = "green" | "yellow" | "red";

type TriageItem = {
  mode: TriageMode;
  summary: string;
  reasoning: string;
  next_action: string;
};

const MOCK_ITEMS: TriageItem[] = [
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
      "Run a simple A/B: shorten the hero copy, move the main CTA above the fold, and test a risk-reversal line like “30-day money-back guarantee.”",
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

export default function TriageFeed() {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-100">
          Triage Feed · Preview
        </h3>
        <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
          Example output
        </p>
      </div>

      {MOCK_ITEMS.map((item, idx) => (
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