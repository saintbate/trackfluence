// app/page.tsx
import { redirect } from "next/navigation";

/**
 * Root route -> /overview
 * Keeps the homepage from rendering a blank screen by
 * immediately routing users to the dashboard.
 */
export default function Home() {
  redirect("/overview");
  // Return null as a safeguard; Next.js will navigate before rendering.
  return null;
}