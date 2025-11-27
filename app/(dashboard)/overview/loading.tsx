export default function OverviewLoading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <header className="flex flex-col gap-2 border-b border-zinc-800 pb-5">
        <div className="h-6 w-40 animate-pulse rounded bg-zinc-800" />
        <div className="h-4 w-72 animate-pulse rounded bg-zinc-800/60" />
      </header>

      {/* Morning Brief skeleton */}
      <section>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 shadow-md">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-7 w-7 animate-pulse rounded-full bg-zinc-800" />
            <div className="h-4 w-28 animate-pulse rounded bg-zinc-800" />
          </div>
          <div className="space-y-3">
            <div className="h-5 w-3/4 animate-pulse rounded bg-zinc-800" />
            <div className="h-4 w-full animate-pulse rounded bg-zinc-800/60" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-800/60" />
          </div>
        </div>
      </section>

      {/* Triage Feed skeleton */}
      <section className="mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 animate-pulse rounded bg-zinc-800" />
          <div className="h-3 w-48 animate-pulse rounded bg-zinc-800/60" />
        </div>
        <div className="space-y-2.5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-zinc-800 border-l-4 border-l-zinc-700 bg-zinc-950/70 p-3"
            >
              <div className="mb-2 h-5 w-20 animate-pulse rounded-full bg-zinc-800" />
              <div className="mb-2 h-4 w-4/5 animate-pulse rounded bg-zinc-800" />
              <div className="mb-2 h-3 w-full animate-pulse rounded bg-zinc-800/60" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-zinc-800/60" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
