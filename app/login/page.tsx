"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) router.replace("/overview");
    })();
  }, [router, supabase]);

  const callbackUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback`
      : undefined;

  async function handleEmailSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: callbackUrl,
        },
      });

      if (error) {
        throw error;
      }

      setNotice(
        "Check your inbox for a magic link to sign in to your Trackfluence dashboard."
      );
      setEmail("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Something went wrong. Please try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl,
        },
      });

      if (error) {
        throw error;
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Google sign-in failed. Please try again.");
      } else {
        setError("Google sign-in failed. Please try again.");
      }
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white flex flex-col items-center justify-center px-4">
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center font-bold">
          T
        </div>
        <span className="text-xl font-semibold">Trackfluence</span>
      </div>

      <div className="w-full max-w-md bg-[#111111] border border-white/5 rounded-2xl p-8 shadow-xl">
        <h1 className="text-2xl font-bold mb-6">Sign in to your dashboard</h1>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        {notice && (
          <div className="mb-4 rounded-lg border border-emerald-500/50 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
            {notice}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleEmailSignIn}>
          <div className="space-y-2">
            <label className="text-sm text-white/80" htmlFor="email">
              Work email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg bg-black/30 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 font-semibold text-sm hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Sending link..." : "Send magic link"}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-white/10" />
          <span className="px-3 text-xs text-white/40">or</span>
          <div className="flex-grow h-px bg-white/10" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-white/10 border border-white/10 hover:bg-white/20 transition text-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Continue with Google
        </button>

        <p className="text-xs text-white/40 mt-6 text-center">
          By continuing, you agree to Trackfluence&apos;s{" "}
          <a className="underline hover:text-white" href="/terms">
            Terms
          </a>{" "}
          and{" "}
          <a className="underline hover:text-white" href="/privacy-policy">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}


