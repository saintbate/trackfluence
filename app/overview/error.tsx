"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OverviewError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log error for debugging
    console.error("Overview page error:", error);
  }, [error]);

  const handleRetry = () => {
    reset();
    router.refresh();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="max-w-md w-full rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <h2 className="text-xl font-semibold text-red-900 mb-2">Something went wrong</h2>
        <p className="text-red-700 mb-4">
          We encountered an error while loading the overview data. Please try again.
        </p>
        {process.env.NODE_ENV !== "production" && error.message && (
          <p className="text-sm text-red-600 mb-4 font-mono">{error.message}</p>
        )}
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

