"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-xl border p-6 shadow-sm">
        <h1 className="text-2xl font-semibold mb-4">Welcome to Trackfluence</h1>
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full rounded-lg border px-4 py-2 font-medium hover:bg-slate-50"
        >
          Continue with Google
        </button>
      </div>
    </main>
  );
}