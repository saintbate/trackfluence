<<<<<<< HEAD
import { z } from "zod";

/**
 * Zod schemas for validating data from Supabase queries.
 */

export const OverviewKpisSchema = z.object({
  totalSpend: z.number().finite(),
  totalRevenue: z.number().finite(),
  roas: z.number().finite(),
  cac: z.number().finite(),
  activeCampaigns: z.number().int().nonnegative(),
});

export type OverviewKpis = z.infer<typeof OverviewKpisSchema>;

export const TopInfluencerRowSchema = z.object({
  influencer_id: z.string(),
  name: z.string(),
  revenue: z.number().finite(),
  spend: z.number().finite(),
  roas: z.number().finite(),
});

export const TopInfluencersSchema = z.array(TopInfluencerRowSchema);

export type TopInfluencerRow = z.infer<typeof TopInfluencerRowSchema>;

export const RevenueByInfluencerPointSchema = z.object({
  name: z.string(),
  revenue: z.number().finite(),
});

export const RevenueByInfluencerSchema = z.array(RevenueByInfluencerPointSchema);

export type RevenueByInfluencerPoint = z.infer<typeof RevenueByInfluencerPointSchema>;

/**
 * Safe validation helper that returns a valid result or logs error and returns safe defaults.
 */
export function validateOrLog<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  defaultValue: T,
  context: string
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[${context}] Validation failed:`, result.error.format());
    return defaultValue;
  }
  return result.data;
}

=======
// /lib/validator.ts
import { z, type ZodSchema } from "zod";

export function validateOrLog<T>(
  schema: ZodSchema<T>,
  value: unknown,
  label: string,
  context?: string // <- make optional
): T {
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    console.warn(`[validateOrLog] ${label}${context ? ` (${context})` : ""} failed`, parsed.error.flatten());
    // Return a sane fallback if you prefer, but throwing is louder during dev
    throw new Error(`Validation failed for ${label}`);
  }
  return parsed.data;
}
>>>>>>> cursor/overview-wire
