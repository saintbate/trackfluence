// lib/demo-data.ts

/**
 * Demo data layer for Trackfluence Demo Mode.
 * All data is static/in-memory — no database reads.
 */

import type { GrowthArchitectMode, GrowthArchitectInsight } from "@/lib/ai/growth-architect";
import type { KPIs } from "@/lib/kpis.shared";

// ============================================================================
// TYPES
// ============================================================================

export type TriageMode = GrowthArchitectMode;

export type TriageItem = GrowthArchitectInsight;

export type DemoCreator = {
  id: string;
  handle: string;
  name: string;
  platform: "tiktok" | "instagram";
  avatar_url: string;
  spend: number;
  revenue: number;
  roas: number;
  ctr: number;
  impressions: number;
  clicks: number;
  orders: number;
  status: "active" | "paused" | "needs_attention";
};

export type DemoMorningBrief = {
  headline: string;
  summary: string;
  highlights: Array<{
    type: "positive" | "warning" | "action";
    text: string;
  }>;
  generatedAt: string;
};

export type DemoOverviewData = {
  morningBrief: DemoMorningBrief;
  triageItems: TriageItem[];
  kpis: KPIs;
  topCreators: DemoCreator[];
};

export type DemoCreatorsDashboardData = {
  creators: DemoCreator[];
  kpis: KPIs;
};

// ============================================================================
// DEMO CREATORS
// ============================================================================

const DEMO_CREATORS: DemoCreator[] = [
  {
    id: "demo-creator-1",
    handle: "@SophiaLifestyle",
    name: "Sophia Chen",
    platform: "tiktok",
    avatar_url: "/placeholder.svg?height=48&width=48&text=SC",
    spend: 12500,
    revenue: 41250,
    roas: 3.3,
    ctr: 2.8,
    impressions: 892000,
    clicks: 24976,
    orders: 412,
    status: "active",
  },
  {
    id: "demo-creator-2",
    handle: "@MarcusFitness",
    name: "Marcus Johnson",
    platform: "tiktok",
    avatar_url: "/placeholder.svg?height=48&width=48&text=MJ",
    spend: 8200,
    revenue: 22140,
    roas: 2.7,
    ctr: 2.1,
    impressions: 645000,
    clicks: 13545,
    orders: 287,
    status: "active",
  },
  {
    id: "demo-creator-3",
    handle: "@EllaBeautyTips",
    name: "Ella Martinez",
    platform: "tiktok",
    avatar_url: "/placeholder.svg?height=48&width=48&text=EM",
    spend: 6800,
    revenue: 8160,
    roas: 1.2,
    ctr: 1.4,
    impressions: 520000,
    clicks: 7280,
    orders: 98,
    status: "needs_attention",
  },
  {
    id: "demo-creator-4",
    handle: "@JakeAdventures",
    name: "Jake Thompson",
    platform: "tiktok",
    avatar_url: "/placeholder.svg?height=48&width=48&text=JT",
    spend: 4500,
    revenue: 3150,
    roas: 0.7,
    ctr: 0.8,
    impressions: 380000,
    clicks: 3040,
    orders: 42,
    status: "paused",
  },
  {
    id: "demo-creator-5",
    handle: "@NinaTechReviews",
    name: "Nina Patel",
    platform: "tiktok",
    avatar_url: "/placeholder.svg?height=48&width=48&text=NP",
    spend: 9800,
    revenue: 38220,
    roas: 3.9,
    ctr: 3.2,
    impressions: 720000,
    clicks: 23040,
    orders: 478,
    status: "active",
  },
  {
    id: "demo-creator-6",
    handle: "@ChefDaniel",
    name: "Daniel Kim",
    platform: "instagram",
    avatar_url: "/placeholder.svg?height=48&width=48&text=DK",
    spend: 5200,
    revenue: 10920,
    roas: 2.1,
    ctr: 1.9,
    impressions: 412000,
    clicks: 7828,
    orders: 156,
    status: "active",
  },
];

// ============================================================================
// DEMO TRIAGE ITEMS
// ============================================================================

const DEMO_TRIAGE_ITEMS: TriageItem[] = [
  {
    mode: "green",
    summary: "Scale @NinaTechReviews — ROAS at 3.9× with room to grow.",
    reasoning:
      "Nina's latest product demo hooks are converting exceptionally well. Her audience has high purchase intent, and CPA has stayed stable even as spend increased 40% last week. This is your most profitable creator right now.",
    next_action:
      "Increase daily budget by 30% on her top two ad sets. Request 2 new variations using her winning hook style within the next 5 days.",
  },
  {
    mode: "green",
    summary: "Double down on @SophiaLifestyle's UGC content.",
    reasoning:
      "Sophia's authentic lifestyle content is driving a 3.3× ROAS with high engagement rates. Her audience resonates with the product in everyday contexts, leading to strong conversion rates.",
    next_action:
      "Lock in a 3-month partnership at current rates before competitors notice. Test her content in broader audience targeting.",
  },
  {
    mode: "yellow",
    summary: "Fix landing page friction for @EllaBeautyTips traffic.",
    reasoning:
      "Ella's CTR is decent at 1.4%, but her ROAS dropped to 1.2× from 2.1× last month. Engagement stays strong but conversions are falling off at checkout. Page load time may be an issue.",
    next_action:
      "Run a speed audit on the landing page. Test a simplified checkout with fewer form fields. Consider adding a limited-time offer for her audience.",
  },
  {
    mode: "red",
    summary: "Pause @JakeAdventures immediately — burning cash.",
    reasoning:
      "ROAS has been below 1.0× for 14 consecutive days. Content-audience mismatch is clear: his adventure/travel audience isn't converting to product purchases despite decent views. Further spend won't fix this.",
    next_action:
      "Pause all active spend today. Reallocate his budget to Nina and Sophia. If you want to retry Jake later, brief him on product-focused content, not lifestyle content.",
  },
  {
    mode: "yellow",
    summary: "Test new hooks for @MarcusFitness to push past plateau.",
    reasoning:
      "Marcus has been steady at 2.7× ROAS for 6 weeks — good but not scaling. His audience responds well, but creative fatigue is showing. CTR dropped 15% over the last 2 weeks.",
    next_action:
      "Request 3 new hook variations focusing on before/after results or customer testimonials. A/B test against current creative to find the next winner.",
  },
];

// ============================================================================
// DEMO MORNING BRIEF
// ============================================================================

const DEMO_MORNING_BRIEF: DemoMorningBrief = {
  headline: "Strong week — but one creator is bleeding cash.",
  summary:
    "Your top performers are driving solid returns, but @JakeAdventures is underwater and needs to be paused today. Overall ROAS is 2.4× with $46,800 in spend generating $112,320 in revenue across 1,473 orders.",
  highlights: [
    {
      type: "positive",
      text: "@NinaTechReviews and @SophiaLifestyle are your profit engines with 3.9× and 3.3× ROAS respectively — scale both.",
    },
    {
      type: "warning",
      text: "@EllaBeautyTips conversion rate dropped 43% — investigate landing page issues before spend continues.",
    },
    {
      type: "action",
      text: "Pause @JakeAdventures today and reallocate his $4,500 weekly budget to proven performers.",
    },
  ],
  generatedAt: new Date().toISOString(),
};

// ============================================================================
// DEMO KPIS
// ============================================================================

function calculateDemoKpis(creators: DemoCreator[]): KPIs {
  const totalSpend = creators.reduce((sum, c) => sum + c.spend, 0);
  const totalRevenue = creators.reduce((sum, c) => sum + c.revenue, 0);
  const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
  const totalOrders = creators.reduce((sum, c) => sum + c.orders, 0);
  const cac = totalOrders > 0 ? totalSpend / totalOrders : 0;

  return {
    totalSpend,
    totalRevenue,
    roas,
    cac,
    activeCampaigns: 3, // Demo has 3 active campaigns
  };
}

// ============================================================================
// EXPORTED FUNCTIONS
// ============================================================================

/**
 * Returns demo data for the /overview page.
 * All data is static and pre-defined.
 */
export async function getDemoOverviewData(): Promise<DemoOverviewData> {
  // Simulate async behavior for consistency with real data fetching
  return {
    morningBrief: DEMO_MORNING_BRIEF,
    triageItems: DEMO_TRIAGE_ITEMS,
    kpis: calculateDemoKpis(DEMO_CREATORS),
    topCreators: DEMO_CREATORS.slice(0, 5),
  };
}

/**
 * Returns demo data for the /creators (influencers) dashboard.
 * All data is static and pre-defined.
 */
export async function getDemoCreatorsDashboardData(): Promise<DemoCreatorsDashboardData> {
  return {
    creators: DEMO_CREATORS,
    kpis: calculateDemoKpis(DEMO_CREATORS),
  };
}

/**
 * Helper to get a single demo creator by ID
 */
export async function getDemoCreator(id: string): Promise<DemoCreator | null> {
  return DEMO_CREATORS.find((c) => c.id === id) ?? null;
}

/**
 * Returns demo timeseries data for charts
 */
export async function getDemoRevenueTimeseries(): Promise<
  { date: string; revenue: number; orders: number }[]
> {
  const today = new Date();
  const points: { date: string; revenue: number; orders: number }[] = [];

  // Generate 30 days of fake data
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().slice(0, 10);

    // Add some variance to make it look realistic
    const baseRevenue = 3500 + Math.random() * 1500;
    const dayOfWeek = date.getDay();
    // Weekends typically have higher sales
    const weekendMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 1.3 : 1;

    const revenue = Math.round(baseRevenue * weekendMultiplier);
    const orders = Math.round(revenue / 80); // ~$80 AOV

    points.push({ date: dateStr, revenue, orders });
  }

  return points;
}

