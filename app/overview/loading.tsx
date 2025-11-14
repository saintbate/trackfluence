/* eslint-disable react-hooks/static-components */
export default function OverviewLoading() {
  const SkeletonCard = () => (
    <div className="rounded-xl border p-4 shadow-sm bg-slate-50 animate-pulse">
      <div className="h-4 w-24 bg-slate-200 rounded mb-2"></div>
      <div className="h-8 w-32 bg-slate-300 rounded"></div>
    </div>
  );

  const SkeletonRow = () => (
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

  return (
    <div style={{ padding: 24 }}>
      <div className="h-8 w-48 bg-slate-200 rounded mb-6 animate-pulse"></div>

      {/* KPIs Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      {/* Chart Skeleton */}
      <div className="mb-6 rounded-xl border bg-white p-6">
        <div className="h-6 w-48 bg-slate-200 rounded mb-4 animate-pulse"></div>
        <div className="h-[300px] bg-slate-50 rounded animate-pulse"></div>
      </div>

      {/* Table Skeleton */}
      <div className="overflow-x-auto rounded-xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left">Influencer</th>
              <th className="px-4 py-3 text-right">Revenue</th>
              <th className="px-4 py-3 text-right">Spend</th>
              <th className="px-4 py-3 text-right">ROAS</th>
            </tr>
          </thead>
          <tbody>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </tbody>
        </table>
      </div>
    </div>
  );
}

