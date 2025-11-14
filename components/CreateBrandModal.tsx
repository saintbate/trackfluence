/* eslint-disable @typescript-eslint/no-explicit-any */
// components/CreateBrandModal.tsx
"use client";

import { useState, useTransition } from "react";

type Props = {
  /** Server action that creates a brand: (formData) => Promise<any> */
  action?: (data: FormData) => Promise<any>;
};

export default function CreateBrandModal({ action }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);

    if (!action) {
      setError("Action not configured");
      return;
    }
    startTransition(async () => {
      try {
        await action(fd);
        setOpen(false);
      } catch (err: any) {
        setError(err?.message ?? "Failed to create brand");
      }
    });
  }

  return (
    <div>
      <button
        className="rounded-md border px-3 py-1 text-sm"
        onClick={() => setOpen(true)}
      >
        + Create Brand
      </button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50">
          <form
            className="w-full max-w-sm rounded-lg border bg-white p-4"
            onSubmit={onSubmit}
          >
            <div className="mb-2 text-lg font-medium">Create a brand</div>

            <label className="mb-2 block text-sm">
              Name
              <input
                name="name"
                required
                className="mt-1 w-full rounded-md border px-3 py-2"
                placeholder="Acme Co"
              />
            </label>

            {error && (
              <div className="mb-2 rounded-md border border-red-300 bg-red-50 p-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md border px-3 py-1 text-sm"
              >
                Cancel
              </button>
              <button
                disabled={isPending}
                className="rounded-md bg-black px-3 py-1 text-sm text-white disabled:opacity-60"
              >
                {isPending ? "Creating…" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}