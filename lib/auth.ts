import { redirect } from "next/navigation";
import getServerSession from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth-options";

/**
 * Server-side auth guard for dashboard routes.
 *
 * Usage:
 *   await requireAuth(); // redirects to /signin if not authenticated
 */
export async function requireAuth() {
  const session = (await getServerSession(authOptions)) as unknown as Session | null;

  if (!session || !session.user) {
    redirect("/signin");
  }

  return session;
}


