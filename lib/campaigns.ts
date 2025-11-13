"use server";

import { z } from "zod";
import { getServiceClient } from "@/lib/supabase";
import { createServerClient } from "@/lib/supabase/server";
import type { Campaign } from "@/lib/types";

const CreateCampaignSchema = z.object({
  name: z.string().min(2).max(80),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  budget: z.string().optional().transform((val) => (val ? parseFloat(val) : null)),
  brand_id: z.string().uuid(),
});

export async function listCampaignsForBrand(brandId: string): Promise<Campaign[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("campaign")
    .select("*")
    .eq("brand_id", brandId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[campaigns] listCampaignsForBrand error", error);
    return [];
  }
  return (data || []) as Campaign[];
}

export async function createCampaign(formData: FormData): Promise<{ ok: true } | { ok: false; message: string }> {
  const supabaseAuth = createServerClient();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();
  if (!user?.email) {
    return { ok: false, message: "Not authenticated" };
  }

  const parsed = CreateCampaignSchema.safeParse({
    name: String(formData.get("name") || ""),
    start_date: String(formData.get("start_date") || ""),
    end_date: String(formData.get("end_date") || ""),
    budget: String(formData.get("budget") || ""),
    brand_id: String(formData.get("brand_id") || ""),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message || "Invalid campaign data" };
  }

  const supabase = getServiceClient();
  const { error } = await supabase
    .from("campaign")
    .insert({
      name: parsed.data.name.trim(),
      brand_id: parsed.data.brand_id,
      start_date: parsed.data.start_date || null,
      end_date: parsed.data.end_date || null,
      budget: parsed.data.budget,
    } as any);

  if (error) {
    console.error("[campaigns] createCampaign error", error);
    return { ok: false, message: "Failed to create campaign" };
  }

  return { ok: true };
}

