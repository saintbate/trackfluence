// components/UserMenu.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/client";

export default function UserMenu() {
  const router = useRouter();
  const supabase = createBrowserClient();

  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? null);
    })();
  }, [supabase]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/signin"); // redirect after logout
  }

  if (!email) return null;

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-slate-500">{email}</span>
      <button
        onClick={handleSignOut}
        className="rounded-lg border px-3 py-1.5"
        aria-label="Sign out"
      >
        Sign out
      </button>
    </div>
  );
}