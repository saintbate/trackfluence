// app/page.tsx
import { redirect } from "next/navigation";
<<<<<<< HEAD
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/overview");
  redirect("/signin");
=======

/**
 * Root route -> /overview
 * Keeps the homepage from rendering a blank screen by
 * immediately routing users to the dashboard.
 */
export default function Home() {
  redirect("/overview");
  // Return null as a safeguard; Next.js will navigate before rendering.
  return null;
>>>>>>> cursor/overview-wire
}