import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";

/**
 * Server-side auth guard for dashboard routes using Supabase Auth.
 *
 * Usage:
 *   await requireAuth(); // redirects to /signin if no Supabase user
 */
export async function requireAuth() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  return user;
}


