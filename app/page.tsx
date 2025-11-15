// app/page.tsx
import { redirect } from "next/navigation";

export default function RootPage() {
  // Send everyone to /signin for now
  redirect("/signin");
}