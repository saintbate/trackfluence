// components/morning-brief.tsx

export default function MorningBrief() {
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
            Gives 2–3 concrete “do this today” actions for your media team.
          </span>
        </li>
      </ul>

      <p className="mt-4 text-xs text-zinc-500">
        Connect TikTok and generate your first insight to turn this preview into
        a live Morning Brief.
      </p>
    </section>
  );
}