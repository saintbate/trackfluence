// app/(dashboard)/overview/ControlsRow.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import BrandPicker from "@/components/controls/BrandPicker";
import DateRangePicker from "@/components/controls/DateRangePicker";
import CampaignSelect from "@/components/controls/CampaignSelect";

export default function ControlsRow(props: {
  containerId: string;
  brandId?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  campaignId?: string | null;
}) {
  const { containerId, brandId, dateFrom, dateTo, campaignId } = props;
  const [brandLoading, setBrandLoading] = useState(false);
  const [dateLoading, setDateLoading] = useState(false);
  const [campaignLoading, setCampaignLoading] = useState(false);
  const isLoading = useMemo(() => brandLoading || dateLoading || campaignLoading, [brandLoading, dateLoading, campaignLoading]);

  useEffect(() => {
    const el = document.getElementById(containerId);
    if (!el) return;
    if (isLoading) {
      el.setAttribute("data-loading", "true");
    } else {
      el.setAttribute("data-loading", "false");
    }
  }, [containerId, isLoading]);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:flex-wrap">
        <BrandPicker initialBrandId={brandId ?? undefined} onLoadingChange={setBrandLoading} />
        <DateRangePicker initialFrom={dateFrom ?? undefined} initialTo={dateTo ?? undefined} onLoadingChange={setDateLoading} />
        {brandId ? (
          <CampaignSelect brandId={brandId} initialCampaignId={campaignId ?? undefined} onLoadingChange={setCampaignLoading} />
        ) : null}
      </div>
    </div>
  );
}



