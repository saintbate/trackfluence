"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/db.types";

let client:
  | ReturnType<typeof createBrowserClient<Database>>
  | undefined;

export function createClient() {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
      throw new Error(
        "[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
      );
    }

    client = createBrowserClient<Database>(url, anonKey);
  }

  return client;
}


