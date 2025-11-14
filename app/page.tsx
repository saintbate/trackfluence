// app/page.tsx
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/**
 * Root route → /overview
 * Keeps the homepage from rendering a blank screen by
 * immediately routing users to the dashboard.
 */
export default function Home() {
  redirect("/overview");
  return null; // safeguard—Next.js will redirect before rendering
}