// /lib/validator.ts
import type { ZodSchema } from "zod";

// Shared data types used across the app
export type OverviewKpis = {
  totalSpend: number;
  totalRevenue: number;
  roas: number;
  cac: number;
  activeCampaigns: number;
};

export type TopInfluencerRow = {
  influencer_id: string;
  name: string;
  revenue: number;
  spend: number;
  roas: number;
};

export type RevenueByInfluencerPoint = {
  name: string;
  revenue: number;
};

export function validateOrLog<T>(
  schema: ZodSchema<T>,
  value: unknown,
  label: string,
  context?: string
): T {
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    console.warn(
      `[validateOrLog] ${label}${context ? ` (${context})` : ""} failed`,
      parsed.error.flatten()
    );
    throw new Error(`Validation failed for ${label}`);
  }
  return parsed.data;
}
