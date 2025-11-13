"use client";

import { useState, useTransition } from "react";

type Props = {
  action: (formData: FormData) => Promise<{ ok: boolean; message?: string }>;
  brandId: string;
};

export default function CreateCampaignModal({ action, brandId }: Props) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <button
        className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-900"
        onClick={() => setOpen(true)}
      >
        + Create Campaign
      </button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border bg-black p-4 shadow-xl">
            <div className="mb-3 text-lg font-semibold">Create Campaign</div>
            <form
              action={(fd) => {
                setError(null);
                startTransition(async () => {
                  const result = await action(fd);
                  if (result.ok) {
                    setOpen(false);
                    // refresh page to show new campaign
                    window.location.reload();
                  } else {
                    setError(result.message ?? "Something went wrong");
                  }
                });
              }}
            >
              <input type="hidden" name="brand_id" value={brandId} />
              
              <label className="mb-2 block text-sm">Campaign name</label>
              <input
                name="name"
                placeholder="Spring 2025 Campaign"
                className="mb-3 w-full rounded-md border bg-black px-3 py-2"
                required
                maxLength={80}
              />

              <label className="mb-2 block text-sm">Start date</label>
              <input
                name="start_date"
                type="date"
                className="mb-3 w-full rounded-md border bg-black px-3 py-2"
              />

              <label className="mb-2 block text-sm">End date</label>
              <input
                name="end_date"
                type="date"
                className="mb-3 w-full rounded-md border bg-black px-3 py-2"
              />

              <label className="mb-2 block text-sm">Budget</label>
              <input
                name="budget"
                type="number"
                step="0.01"
                placeholder="10000.00"
                className="mb-3 w-full rounded-md border bg-black px-3 py-2"
              />

              {error && <div className="mb-2 text-sm text-red-400">{error}</div>}
              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded-md border px-3 py-2 text-sm"
                  onClick={() => setOpen(false)}
                  disabled={pending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md border px-3 py-2 text-sm hover:bg-slate-900 disabled:opacity-50"
                  disabled={pending}
                >
                  {pending ? "Creating…" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

