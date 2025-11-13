export type Brand = {
  id: string;
  name: string;
  owner_user_id?: string | null;
  owner_user_email?: string | null;
  created_at?: string | null;
};

export type Campaign = {
  id: string;
  name: string;
  brand_id?: string;
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
  budget?: number | null;
  created_at?: string | null;
};

import { z } from "zod";

export const TopInfluencersSchema = z.array(z.object({
  influencer_id: z.string(),
  handle: z.string(),
  platform: z.string(),
  spend: z.number().default(0),
  num_orders: z.number().default(0),
  revenue: z.number().default(0),
}));

export const RevenueByInfluencerSchema = z.array(z.object({
  influencer_id: z.string(),
  handle: z.string(),
  platform: z.string(),
  revenue: z.number().default(0),
}));

export const OverviewKpisSchema = z.object({
  totalSpend: z.number().default(0),
  totalRevenue: z.number().default(0),
  roas: z.number().default(0),
  cac: z.number().default(0),
  activeCampaigns: z.number().default(0),
});

export type OverviewKpis = z.infer<typeof OverviewKpisSchema>;