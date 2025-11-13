"use server";

import { detachTikTokAccount } from "@/lib/tiktok/oauth";
import { getServiceClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function disconnectTikTok(brandId: string, businessAccountId: string) {
  await detachTikTokAccount(brandId, businessAccountId);
  revalidatePath("/settings/accounts");
}

export async function listTikTokAccounts(brandId: string) {
  const supa = getServiceClient();
  const { data } = await supa
    .from("brand_social_account")
    .select("*")
    .eq("brand_id", brandId)
    .eq("platform", "tiktok");
  return data ?? [];
}


