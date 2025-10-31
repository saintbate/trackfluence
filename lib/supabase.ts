import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

/**
 * Get Supabase client for browser/client-side use.
 */
export function getBrowserClient(): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/**
 * Get Supabase client for server-side use with RLS.
 * Passes the session access token if available to enable RLS policies.
 */
export function getServerClient(accessToken?: string): SupabaseClient {
  const options: any = {};
  
  if (accessToken) {
    options.global = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
  }
  
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, options);
}

/**
 * Get Supabase client with service role key for elevated access.
 * Use sparingly and only when necessary (e.g., admin operations).
 */
export function getServiceClient(): SupabaseClient {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(SUPABASE_URL, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

