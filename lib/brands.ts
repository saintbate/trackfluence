"use server";

import { z } from "zod";
import { createServerClient } from "@/lib/supabase/server";
import type { Brand } from "@/lib/types";

const CreateBrandSchema = z.object({
  name: z.string().min(2).max(80),
});

/** List the authenticated user's brands via id OR email */
export async function listBrandsForUser(): Promise<Brand[]> {
  const supabaseAuth = await createServerClient();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  if (!user?.email) return [];

  const { data, error } = await supabaseAuth
    .from("brand")
    .select("*")
    .or(`owner_user_id.eq.${user.id},owner_user_email.eq.${user.email}`)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[brand] listBrandsForUser error:", error);
    return [];
  }
  return (data ?? []) as Brand[];
}

/** Create a brand owned by the authenticated user */
export async function createBrand(
  formData: FormData
): Promise<{ ok: true } | { ok: false; message: string }> {
  const supabase = await createServerClient();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr) {
    console.error("[brand] createBrand getUser error:", userErr);
  }
  if (!user?.email) {
    return { ok: false, message: "Not authenticated" };
  }

  const parsed = CreateBrandSchema.safeParse({
    name: String(formData.get("name") ?? ""),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid name" };
  }

  const { error } = await supabase.from("brand").insert({
    name: parsed.data.name.trim(),
    owner_user_id: user.id,
    owner_user_email: user.email,
  });

  if (error) {
    console.error("[brand] createBrand insert error:", error);
    return { ok: false, message: "Failed to create brand" };
  }
  return { ok: true };
}