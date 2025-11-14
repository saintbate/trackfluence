import Link from "next/link";

type Props = {
  platform: "instagram" | "tiktok";
  brandId: string;
  accounts: { external_account_id: string; account_name?: string | null }[];
  connectHref: string;
  children?: React.ReactNode;
};

export default function AccountCard({ platform, brandId: _brandId, accounts, connectHref, children }: Props) {
  void _brandId;
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {platform === "instagram" ? "Instagram" : "TikTok"}
        </h2>
        <div className="flex items-center gap-2">{children}</div>
      </div>
      {accounts.length > 0 ? (
        <table className="min-w-full text-sm">
          <thead className="bg-white/5 text-slate-300">
            <tr>
              <th className="px-4 py-3 text-left">Account</th>
              <th className="px-4 py-3 text-left">External ID</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((r) => (
              <tr key={r.external_account_id} className="border-t border-white/10">
                <td className="px-4 py-3">{r.account_name ?? (platform === "instagram" ? "Instagram" : "TikTok")}</td>
                <td className="px-4 py-3">{r.external_account_id}</td>
                <td className="px-4 py-3">
                  {/* Per-row actions should be rendered by parent using forms; this is a presentational fallback */}
                  <span className="text-xs text-slate-500">Connected</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="px-4 pb-4 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span>No {platform} accounts connected for this brand.</span>
            {connectHref ? (
              <Link
                href={connectHref}
                className="rounded border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                Connect {platform === "instagram" ? "Instagram" : "TikTok"}
              </Link>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}


