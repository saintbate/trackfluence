// lib/supabase/index.ts
import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using SERVICE ROLE key.
 * Bypasses RLS for trusted server actions and API routes.
 */
export function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  if (!serviceKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY (service role) — selects will be blocked by RLS without this"
    );
  }

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}