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

      setNotice(
        "Check your inbox for a magic link to securely sign in to Trackfluence."
      );
      setEmail("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";
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
      const message =
        error instanceof Error ? error.message : "Something went wrong.";
      setNotice(message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050816] via-[#050816] to-[#020617] text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="mb-6 flex items-center gap-3 justify-center">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-[#22d3ee] to-[#6366f1] flex items-center justify-center text-sm font-semibold">
            T
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Trackfluence
          </span>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/5 bg-black/40 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.7)] px-6 py-7 sm:px-8 sm:py-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Sign in to your workspace
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Use your work email to access campaign dashboards and creator
              analytics.
            </p>
          </div>

          {/* Notice / error */}
          {notice && (
            <div className="mb-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-2.5 text-xs sm:text-sm text-cyan-100">
              {notice}
            </div>
          )}

          {/* Email + magic link form */}
          <form className="space-y-4" onSubmit={signInWithEmail}>
            <label className="block text-xs font-medium text-slate-300">
              Work email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="mt-1.5 w-full rounded-2xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 outline-none ring-0 transition focus:border-cyan-400/70 focus:bg-black/60"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#22d3ee] to-[#6366f1] px-4 py-2.5 text-sm font-medium text-white shadow-[0_10px_35px_rgba(37,99,235,0.55)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending magic link..." : "Send magic link"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-slate-500">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
            <span>or</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          </div>

          {/* Google button */}
          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:border-slate-400/50 hover:bg-black/60 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4"
            >
              <path
                fill="#EA4335"
                d="M11.99 10.2v3.92h5.47c-.24 1.26-.98 2.32-2.09 3.03l3.38 2.63c1.97-1.82 3.11-4.5 3.11-7.66 0-.74-.07-1.45-.2-2.14H11.99z"
              />
              <path
                fill="#34A853"
                d="M4.73 14.32 3.89 15.0l-2.7 2.08C3.11 20.54 7.23 23 11.99 23c3.24 0 5.96-1.07 7.94-2.9l-3.38-2.63c-1.06.7-2.41 1.12-4.56 1.12-3.5 0-6.48-2.36-7.56-5.57z"
              />
              <path
                fill="#4A90E2"
                d="M2.19 6.92A10.96 10.96 0 0 0 1 11.5c0 1.65.39 3.2 1.19 4.58l3.54-2.76a6.53 6.53 0 0 1-.36-2.09c0-.72.13-1.42.36-2.09z"
              />
              <path
                fill="#FBBC05"
                d="M11.99 4.38c1.76 0 3.34.61 4.59 1.8l3.43-3.43C17.93 1.02 15.22 0 11.99 0 7.23 0 3.11 2.46 1.19 6.92l3.54 2.76c1.08-3.21 4.06-5.57 7.56-5.57z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Small footnote */}
          <p className="mt-4 text-[11px] text-slate-500 text-center leading-relaxed">
            By signing in, you agree to Trackfluence&apos;s{" "}
            <a
              href="https://trackfluence.app/terms"
              className="text-slate-300 underline-offset-2 hover:underline"
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="https://trackfluence.app/privacy"
              className="text-slate-300 underline-offset-2 hover:underline"
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