// components/controls/DateWindowPicker.tsx
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export type DateWindowPickerProps = {
  dateFrom: string;
  dateTo: string;
};

function DateWindowPicker({ dateFrom, dateTo }: DateWindowPickerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function setParam(key: "dateFrom" | "dateTo", value: string) {
    const q = new URLSearchParams(params.toString());
    q.set(key, value);

    // guard: if user sets "from" after "to", swap to keep order sane
    const f = q.get("dateFrom");
    const t = q.get("dateTo");
    if (f && t && f > t) {
      // swap
      q.set("dateFrom", t);
      q.set("dateTo", f);
    }

    router.replace(`${pathname}?${q.toString()}`);
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <label className="sr-only" htmlFor="dateFrom">From</label>
      <input
        id="dateFrom"
        type="date"
        value={dateFrom ?? ""}
        onChange={(e) => setParam("dateFrom", e.target.value)}
        className="rounded border bg-transparent px-2 py-1"
      />

      <span>—</span>

      <label className="sr-only" htmlFor="dateTo">To</label>
      <input
        id="dateTo"
        type="date"
        value={dateTo ?? ""}
        onChange={(e) => setParam("dateTo", e.target.value)}
        className="rounded border bg-transparent px-2 py-1"
      />
    </div>
  );
}

export default DateWindowPicker;

// Force module mode for TS (prevents TS2306 in edge cases)
export {};