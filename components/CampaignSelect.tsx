"use client";

import type { Campaign } from "@/lib/types";

type Props = {
  campaigns: Campaign[];
  selectedCampaignId: string | null;
  onChange: (campaignId: string | null) => void;
};

export default function CampaignSelect({ campaigns, selectedCampaignId, onChange }: Props) {
  return (
    <select
      value={selectedCampaignId || ""}
      onChange={(e) => onChange(e.target.value || null)}
      className="rounded-lg border bg-black px-3 py-2 text-sm"
    >
      <option value="">All Campaigns</option>
      {campaigns.map((campaign) => (
        <option key={campaign.id} value={campaign.id}>
          {campaign.name}
        </option>
      ))}
    </select>
  );
}

