/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerClient } from "@/lib/supabase/server";
import AccountCard from "@/app/(dashboard)/settings/accounts/components/AccountCard";
import { disconnectTikTok } from "@/app/(dashboard)/settings/actions/tiktok";
import { disconnectInstagram } from "@/app/(dashboard)/settings/actions/instagram";
import { refreshInstagram } from "@/app/(dashboard)/actions/instagram";
import { refreshTikTok } from "@/app/(dashboard)/actions/tiktok";

export default async function AccountsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const brandId = typeof sp?.brandId === "string" ? sp.brandId : null;
  const supabase = createServerClient();
  const { data: igRows } = brandId
    ? await supabase.from("brand_social_account").select("external_account_id, account_name, connected_at").eq("brand_id", brandId).eq("platform", "instagram")
    : { data: [] as any[] };
  const { data: ttRows } = brandId
    ? await supabase.from("brand_social_account").select("external_account_id, account_name, connected_at").eq("brand_id", brandId).eq("platform", "tiktok")
    : { data: [] as any[] };

  const today = new Date();
  const to = today.toISOString().slice(0, 10);
  const fromDate = new Date(today);
  fromDate.setDate(today.getDate() - 29);
  const from = fromDate.toISOString().slice(0, 10);

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
    <div className="space-y-6">
      <h1 data-page-title className="text-lg font-semibold text-slate-900 dark:text-slate-100">Accounts</h1>
      {!brandId ? (
        <div className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
          <p className="text-slate-600 dark:text-slate-300">Select a brand to manage social accounts.</p>
        </div>
      ) : (
        <>
          <AccountCard
            platform="instagram"
            brandId={brandId}
            accounts={(igRows ?? []) as any}
            connectHref={"#"}
          >
            <a
              href={`/api/instagram/ingest?brandId=${brandId}&from=${from}&to=${to}&dryRun=1`}
              className="rounded border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              target="_blank"
              rel="noreferrer"
              title="Test (mock) fetch in a new tab"
            >
              Test (mock)
            </a>
            <form action={refreshIG}>
              <input type="hidden" name="brandId" value={brandId} />
              <input type="hidden" name="from" value={from} />
              <input type="hidden" name="to" value={to} />
              <button type="submit" className="rounded border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                Refresh
              </button>
            </form>
            {(igRows ?? []).map((r) => (
              <form
                key={r.external_account_id}
                action={async () => {
                  "use server";
                  await disconnectInstagram(brandId, r.external_account_id);
                }}
              >
                <button type="submit" className="rounded border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                  Disconnect {r.external_account_id}
                </button>
              </form>
            ))}
          </AccountCard>

          <AccountCard
            platform="tiktok"
            brandId={brandId}
            accounts={(ttRows ?? []) as any}
            connectHref={`/api/tiktok/oauth/start?brandId=${brandId}`}
          >
            <a
              href={`/api/tiktok/ingest?brandId=${brandId}&from=${from}&to=${to}&dryRun=1`}
              className="rounded border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              target="_blank"
              rel="noreferrer"
              title="Test (mock) fetch in a new tab"
            >
              Test (mock)
            </a>
            <form action={refreshTT}>
              <input type="hidden" name="brandId" value={brandId} />
              <input type="hidden" name="from" value={from} />
              <input type="hidden" name="to" value={to} />
              <button type="submit" className="rounded border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                Refresh
              </button>
            </form>
            {(ttRows ?? []).map((r) => (
              <form
                key={r.external_account_id}
                action={async () => {
                  "use server";
                  await disconnectTikTok(brandId, r.external_account_id);
                }}
              >
                <button type="submit" className="rounded border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                  Disconnect {r.external_account_id}
                </button>
              </form>
            ))}
          </AccountCard>
        </>
      )}
    </div>
  );
}


