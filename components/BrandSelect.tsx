"use client";
import { useState } from "react";
import useSWR from "swr";
import CreateBrandModal from "./CreateBrandModal";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function BrandSelect({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (brandId: string) => void;
}) {
  const { data, error, isLoading, mutate } = useSWR<{ brands: { id: string; name: string }[] }>(
    "/api/brands",
    fetcher
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBrandCreated = async (brandId: string) => {
    // Refresh the brand list
    await mutate();
    // Select the newly created brand
    onChange(brandId);
  };

  if (isLoading) return <div className="text-sm text-slate-500 mb-2">Loading brands…</div>;
  if (error) return <div className="text-sm text-red-600 mb-2">Error loading brands.</div>;

  const brands = data?.brands ?? [];

  return (
    <>
      <div className="mb-3">
        <label className="block text-sm text-slate-600 mb-1">Brand</label>
        <div className="flex gap-2">
          <select
            className="flex-1 md:w-80 rounded-lg border border-slate-300 p-2"
            value={value ?? brands[0]?.id ?? ""}
            onChange={(e) => onChange(e.target.value)}
          >
            {brands.length === 0 ? (
              <option value="">No brands available</option>
            ) : (
              brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))
            )}
          </select>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            title="Create new brand"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden md:inline">New Brand</span>
          </button>
        </div>
      </div>

      <CreateBrandModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleBrandCreated}
      />
    </>
  );
}