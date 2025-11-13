import { refreshInstagram } from "@/app/(dashboard)/actions/instagram";
import { refreshTikTok } from "@/app/(dashboard)/actions/tiktok";

export default function RefreshDropdown({ brandId, from, to }: { brandId?: string | null; from?: string | null; to?: string | null }) {
  if (!brandId || !from || !to) {
    return (
      <button
        type="button"
        disabled
        className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-700 shadow-sm opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        title="Select brand and date range to refresh"
      >
        Refresh Social
      </button>
    );
  }
  async function refreshIG(formData: FormData) {
    "use server";
    const b = String(formData.get("brandId") || "");
    const f = String(formData.get("from") || "");
    const t = String(formData.get("to") || "");
    if (b && f && t) {
      await refreshInstagram(b, f, t);
    }
  }
  async function refreshTT(formData: FormData) {
    "use server";
    const b = String(formData.get("brandId") || "");
    const f = String(formData.get("from") || "");
    const t = String(formData.get("to") || "");
    if (b && f && t) {
      await refreshTikTok(b, f, t);
    }
  }
  return (
    <details className="relative">
      <summary className="list-none rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer">
        Refresh Social
      </summary>
      <div className="absolute right-0 z-10 mt-2 w-44 overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
        <form action={refreshIG} className="border-b border-slate-100 dark:border-slate-800">
          <input type="hidden" name="brandId" value={brandId} />
          <input type="hidden" name="from" value={from} />
          <input type="hidden" name="to" value={to} />
          <button type="submit" className="block w-full px-3 py-2 text-left text-xs hover:bg-slate-50 dark:hover:bg-slate-800">
            Refresh Instagram
          </button>
        </form>
        <form action={refreshTT}>
          <input type="hidden" name="brandId" value={brandId} />
          <input type="hidden" name="from" value={from} />
          <input type="hidden" name="to" value={to} />
          <button type="submit" className="block w-full px-3 py-2 text-left text-xs hover:bg-slate-50 dark:hover:bg-slate-800">
            Refresh TikTok
          </button>
        </form>
      </div>
    </details>
  );
}


