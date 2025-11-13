"use server";

import { getServiceClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function disconnectInstagram(brandId: string, externalAccountId: string) {
  const supa = getServiceClient();
  const { data } = await (supa as any)
    .from("brand_social_account")
    .select("secret_key")
    .eq("brand_id", brandId)
    .eq("platform", "instagram")
    .eq("external_account_id", externalAccountId)
    .maybeSingle();
  await (supa as any)
    .from("brand_social_account")
    .delete()
    .match({ brand_id: brandId, platform: "instagram", external_account_id: externalAccountId });
  if ((data as any)?.secret_key) {
    await (supa as any).from("secrets").delete().eq("key", (data as any).secret_key);
  }
  revalidatePath("/settings/accounts");
}


