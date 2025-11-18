// app/signin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/client";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

export default function SignInPage() {
  const router = useRouter();
  const supabase = createBrowserClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // If already signed in, hop to overview.
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) router.replace("/overview");
    })();
  }, [router, supabase]);

  async function signInWithEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setNotice(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: APP_URL ? `${APP_URL}/auth/callback` : undefined,
        },
      });
      if (error) throw error;
      setNotice("Check your email for a sign-in link.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      setNotice(message);
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    setLoading(true);
    setNotice(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: APP_URL ? `${APP_URL}/auth/callback` : undefined,
        },
      });
      if (error) throw error;
      // Supabase will redirect to Google; no further action here.
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      setNotice(message);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl border px-6 space-y-5">
        <h1 className="text-2xl font-semibold">Sign in</h1>

        <form onSubmit={signInWithEmail} className="space-y-3">
          <label className="block text-sm">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 outline-none"
            placeholder="you@company.com"
          />
          <button type="submit" disabled={loading} className="w-full rounded-lg border px-3 py-2 font-medium">
            {loading ? "Sending link…" : "Send magic link"}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">or</div>

        <button onClick={signInWithGoogle} disabled={loading} className="w-full rounded-lg border px-3 py-2 font-medium">
          {loading ? "Opening Google…" : "Continue with Google"}
        </button>

        {notice && (
          <div className="text-sm text-center text-slate-600">
            {notice}
          </div>
        )}
      </div>
    </main>
  );
}