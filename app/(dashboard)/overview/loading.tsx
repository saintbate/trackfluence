/* eslint-disable @typescript-eslint/no-unused-vars */
// app/(dashboard)/overview/loading.tsx
function SkeletonCard() {
  return (
    <div className="rounded-xl border p-4 shadow-sm bg-slate-50 animate-pulse">
      <div className="h-4 w-24 bg-slate-200 rounded mb-2" />
      <div className="h-8 w-32 bg-slate-300 rounded" />
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-t">
      <td className="px-4 py-3">
        <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="h-4 w-20 bg-slate-200 rounded animate-pulse ml-auto"></div>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="h-4 w-20 bg-slate-200 rounded animate-pulse ml-auto"></div>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="h-4 w-16 bg-slate-200 rounded animate-pulse ml-auto"></div>
      </td>
    </tr>
  );
}

export default function OverviewLoading() {
  return (
    <div className="container py-6">
      <div className="h-8 w-48 bg-slate-200 rounded mb-6 animate-pulse"></div>

      {/* KPIs Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      {/* Chart Skeleton */}
      <div className="rounded-2xl border p-4 shadow-sm bg-white mb-6">
        <div className="h-6 w-56 bg-slate-200 rounded mb-4 animate-pulse"></div>
        <div className="h-64 bg-slate-100 rounded animate-pulse"></div>
      </div>

      {/* Table Skeleton */}
      <div className="overflow-hidden rounded-2xl border bg-white ring-1 ring-inset ring-black/5">
        <div className="h-10 bg-slate-100 animate-pulse"></div>
        <table className="min-w-full divide-y divide-white/5">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-400">Influencer</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-400">Platform</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-400">Revenue</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-400">Orders</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
}



