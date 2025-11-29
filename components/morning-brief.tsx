// components/morning-brief.tsx
"use client";

import Link from "next/link";
import { FlaskConical } from "lucide-react";
import type { DemoMorningBrief } from "@/lib/demo-data";

type MorningBriefProps = {
  /** When provided, displays actual brief content. Otherwise shows placeholder. */
  data?: DemoMorningBrief | null;
  /** Whether demo mode is active */
  isDemo?: boolean;
};

export default function MorningBrief({ data, isDemo = false }: MorningBriefProps) {
  // If we have actual data, render the real brief
  if (data) {
    return (
      <section className="rounded-3xl border border-zinc-800/80 bg-zinc-950/60 p-6 shadow-lg shadow-black/40">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-emerald-300 uppercase">
            Morning Brief {isDemo && (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400 normal-case tracking-normal">
                <FlaskConical className="h-2.5 w-2.5" />
                Demo
              </span>
            )}
          </p>
        </div>

        <h2 className="mt-3 text-lg font-semibold text-zinc-50">{data.headline}</h2>

        <p className="mt-2 text-sm text-zinc-400">{data.summary}</p>

        <ul className="mt-4 space-y-2 text-sm text-zinc-300">
          {data.highlights.map((highlight, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span
                className={`mt-1 h-1.5 w-1.5 rounded-full ${
                  highlight.type === "positive"
                    ? "bg-emerald-400"
                    : highlight.type === "warning"
                    ? "bg-amber-300"
                    : "bg-sky-400"
                }`}
              />
              <span>{highlight.text}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-zinc-500">
            Generated {new Date(data.generatedAt).toLocaleString()}
          </p>
          {isDemo && (
            <p className="text-[10px] text-amber-500/70">
              Based on sample data
            </p>
          )}
        </div>
      </section>
    );
  }

  // Otherwise, show the preview/placeholder state
  return (
    <section className="rounded-3xl border border-zinc-800/80 bg-zinc-950/60 p-6 shadow-lg shadow-black/40">
      <p className="text-[11px] font-semibold tracking-[0.2em] text-emerald-300 uppercase">
        Morning Brief · Preview
      </p>

      <h2 className="mt-3 text-lg font-semibold text-zinc-50">
        Your daily Growth Architect summary.
      </h2>

      <p className="mt-2 text-sm text-zinc-400">
        Once you connect TikTok and generate your first insight, the Growth
        Architect will send a short, ruthless-but-honest brief every morning so
        you know exactly what changed and what to do next.
      </p>

      <ul className="mt-4 space-y-2 text-sm text-zinc-300">
        <li className="flex items-start gap-2">
          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>
            Highlights your top creators and campaigns by ROAS, spend, and
            revenue.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-300" />
          <span>
            Flags weak spots before they become expensive problems.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
          <span>
            Gives 2–3 concrete &ldquo;do this today&rdquo; actions for your media team.
          </span>
        </li>
      </ul>

      <div className="mt-5 flex flex-col gap-3 border-t border-zinc-800/60 pt-5">
        <p className="text-xs text-zinc-500">
          Connect TikTok and generate your first insight to turn this preview into
          a live Morning Brief.
        </p>
        
        {/* Demo CTA */}
        <Link
          href="/overview?demo=1"
          className="inline-flex items-center gap-1.5 self-start rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-400 transition hover:bg-amber-500/20"
        >
          <FlaskConical className="h-3.5 w-3.5" />
          Explore a live demo with sample data
        </Link>
      </div>
    </section>
  );
}
