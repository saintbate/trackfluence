import Link from "next/link";

export default function CampaignsPage() {
  return (
    <div className="p-6">
      <h1 data-page-title className="text-lg font-semibold text-slate-900 dark:text-slate-100">
        Campaigns
      </h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Coming soon.{" "}
        <Link href="/overview?demo=1" className="text-emerald-500 underline underline-offset-2 hover:text-emerald-400">
          Try demo mode
        </Link>{" "}
        on the overview page to preview the Growth Architect.
      </p>
    </div>
  );
}
