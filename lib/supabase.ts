import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/db.types";

/** Service role client for server-only usage (uses SERVICE_ROLE key). */
export function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient<Database>(url, serviceRoleKey, { auth: { persistSession: false } });
}