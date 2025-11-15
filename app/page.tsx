// app/page.tsx
import Link from "next/link";

export default function RootPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-semibold">Trackfluence</h1>
        <p className="opacity-80">
          Root route is working in production.
        </p>
        <div className="space-x-4">
          <Link href="/signin" className="underline">
            Go to /signin
          </Link>
          <Link href="/overview" className="underline">
            Go to /overview
          </Link>
        </div>
      </div>
    </main>
  );
}