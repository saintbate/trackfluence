// app/signin/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/client";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

export default function SignInPage() {
  const router = useRouter();
  const supabase = createBrowserClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // If already signed in, hop to overview.
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) router.replace("/overview");
    })();
  }, [router, supabase]);

  const callbackUrl = APP_URL ? `${APP_URL}/auth/callback` : undefined;

  async function signInWithEmail(e: React.FormEvent<HTMLFormElement>) {
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
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
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
      // Supabase will redirect to Google; no further action here.
    } catch (err: any) {
      setError(err.message || "Google sign-in failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo + Pill */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2 rounded-full bg-slate-900/70 px-4 py-2 border border-slate-800 shadow-lg">
            <div className="h-7 w-7 rounded-full bg-cyan-500 flex items-center justify-center text-xs font-semibold text-slate-950">
              T
            </div>
            <span className="text-sm font-medium tracking-tight">
              Trackfluence
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 shadow-xl backdrop-blur-md p-8 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Sign in to your dashboard
            </h1>
            <p className="text-sm text-slate-400">
              Track every creator. Prove every campaign.
            </p>
          </div>

          {/* Status messages */}
          {error && (
            <div className="rounded-lg border border-red-500/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          )}

          {notice && (
            <div className="rounded-lg border border-emerald-500/60 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
              {notice}
            </div>
          )}

          {/* Email form */}
          <form onSubmit={signInWithEmail} className="space-y-4">
            <div className="space-y-2 text-left">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-200"
              >
                Work email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none ring-0 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/40 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-medium text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending magic link…" : "Send magic link"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <div className="h-px flex-1 bg-slate-800" />
            <span>or</span>
            <div className="h-px flex-1 bg-slate-800" />
          </div>

          {/* Google button */}
          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-800 transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-slate-900">
              G
            </span>
            Continue with Google
          </button>

          <p className="text-[11px] leading-relaxed text-slate-500 text-center">
            By continuing, you agree to Trackfluence&apos;s{" "}
            <a
              href="https://trackfluence.app/terms"
              className="text-cyan-400 hover:text-cyan-300 underline-offset-2 hover:underline"
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="https://trackfluence.app/privacy"
              className="text-cyan-400 hover:text-cyan-300 underline-offset-2 hover:underline"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}