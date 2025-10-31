import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import OverviewKpis from "@/components/OverviewKpis";
import TopInfluencers from "@/components/Topinfluencers";
import RevenueByInfluencerChart from "@/components/RevenueByInfluencerChart";
import { getOverviewKpis, getTopInfluencers, getRevenueByInfluencer } from "@/lib/kpis";
import { getServerClient } from "@/lib/supabase";
import { validateOrLog } from "@/lib/validator";
import {
  OverviewKpisSchema,
  TopInfluencersSchema,
  RevenueByInfluencerSchema,
} from "@/lib/validator";

export default async function OverviewPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/signin");
  }

  // Get brandId from session or fetch first brand for user
  // TODO: Add brand_id to session.user if your schema supports it
  let brandId: string | null = null;

  // Try to get brand_id from session (if stored)
  if ((session.user as any)?.brand_id) {
    brandId = (session.user as any).brand_id;
  } else {
    // Fetch first brand for the user
    const supabase = getServerClient();
    // TODO: If brand table has owner_user_id or user_id, filter by that
    // For now, we'll get the first brand (assuming RLS handles permissions)
    const { data: brands, error: brandError } = await supabase
      .from("brand")
      .select("id")
      .limit(1);

    if (brandError) {
      console.error("Failed to fetch brand:", brandError.message);
    } else if (brands && brands.length > 0) {
      brandId = brands[0].id;
    }
  }

  if (!brandId) {
    return (
      <div className="p-8 text-center text-slate-600">
        No brand found. Please create a brand first.
      </div>
    );
  }

  // Get access token from session if available (for RLS)
  const accessToken = (session as any).accessToken;

  // Fetch all data in parallel
  const [kpisResult, topInfluencersResult, revenueResult] = await Promise.allSettled([
    getOverviewKpis({ brandId, accessToken }),
    getTopInfluencers({ brandId, limit: 5, accessToken }),
    getRevenueByInfluencer({ brandId, limit: 10, accessToken }),
  ]);

  // Validate and get safe defaults
  const kpis = validateOrLog(
    OverviewKpisSchema,
    kpisResult.status === "fulfilled" ? kpisResult.value : null,
    { totalSpend: 0, totalRevenue: 0, roas: 0, cac: 0, activeCampaigns: 0 },
    "OverviewKPIs"
  );

  const topInfluencers = validateOrLog(
    TopInfluencersSchema,
    topInfluencersResult.status === "fulfilled" ? topInfluencersResult.value : [],
    [],
    "TopInfluencers"
  );

  const revenueByInfluencer = validateOrLog(
    RevenueByInfluencerSchema,
    revenueResult.status === "fulfilled" ? revenueResult.value : [],
    [],
    "RevenueByInfluencer"
  );

  // Log smoke test data when not in production
  if (process.env.NODE_ENV !== "production") {
    console.log("[Overview] Data counts:", {
      kpis,
      topInfluencersCount: topInfluencers.length,
      revenueByInfluencerCount: revenueByInfluencer.length,
    });
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 className="text-2xl font-bold mb-6">Overview</h1>

      <OverviewKpis
        totalSpend={kpis.totalSpend}
        totalRevenue={kpis.totalRevenue}
        roas={kpis.roas}
        cac={kpis.cac}
        activeCampaigns={kpis.activeCampaigns}
      />

      <RevenueByInfluencerChart points={revenueByInfluencer} />

      <TopInfluencers rows={topInfluencers} />
    </div>
  );
}
