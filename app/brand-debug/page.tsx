/* eslint-disable @typescript-eslint/no-explicit-any */
// Server Component page that shows your current user + their brand rows
import React from "react";
import { createServerClient } from "@/lib/supabase/server";

export default async function BrandDebugPage() {
  const supabase = await createServerClient();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  let brands: any[] = [];
  let brandErr: string | null = null;

  if (user?.email) {
    const { data, error } = await supabase
      .from("brand")
      .select("*")
      .or(`owner_user_id.eq.${user.id},owner_user_email.eq.${user.email}`)
      .order("created_at", { ascending: true });

    brands = data ?? [];
    brandErr = error ? error.message : null;
  } else {
    brandErr = userErr?.message ?? "User not authenticated";
  }

  return (
    <main style={{ padding: 24, fontFamily: "ui-sans-serif, system-ui" }}>
      <h1>Brand Debug</h1>

      <h2 style={{ marginTop: 16 }}>User</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>

      <h2 style={{ marginTop: 16 }}>Brands</h2>
      {brandErr && <pre style={{ color: "crimson" }}>{brandErr}</pre>}
      <pre>{JSON.stringify(brands, null, 2)}</pre>
    </main>
  );
}