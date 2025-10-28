"use client";

import { useState, useEffect } from "react";

export default function ExportCsvButton({
  data,
  filename
}: {
  data: any[];
  filename: string;
}) {
  const [userTier, setUserTier] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    // Fetch user tier
    const fetchUserTier = async () => {
      try {
        const response = await fetch("/api/billing/status");
        const data = await response.json();
        setUserTier(data.tier || "FREE");
      } catch (error) {
        console.error("Error fetching user tier:", error);
        setUserTier("FREE");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserTier();
  }, []);

  const handleExport = () => {
    if (!data || data.length === 0) {
      alert("No data to export");
      return;
    }

    // Check if user has PRO tier
    if (userTier !== "PRO") {
      setShowUpgradeModal(true);
      return;
    }

    // Extract headers from the keys of the first object
    const headers = Object.keys(data[0]);
    
    // Create CSV header row
    const csvHeaders = headers.join(",");
    
    // Create CSV data rows
    const csvRows = data.map(row => {
      return headers.map(header => {
        const value = row[header];
        
        // Handle null/undefined
        if (value === null || value === undefined) {
          return "";
        }
        
        // Convert to string and escape quotes
        const stringValue = String(value);
        
        // If the value contains comma, newline, or quote, wrap in quotes and escape quotes
        if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        
        return stringValue;
      }).join(",");
    });
    
    // Combine headers and rows
    const csv = [csvHeaders, ...csvRows].join("\n");
    
    // Create blob and trigger download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    URL.revokeObjectURL(url);
  };

  const handleUpgrade = async () => {
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
      });
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      alert("Failed to start checkout. Please try again.");
    }
  };

  return (
    <>
      <button
        onClick={handleExport}
        className="px-4 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative"
        disabled={!data || data.length === 0 || isLoading}
        title={userTier !== "PRO" ? "PRO feature - Upgrade to export" : "Export CSV"}
      >
        {userTier !== "PRO" && (
          <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs font-semibold bg-amber-500 text-white rounded">
            PRO
          </span>
        )}
        Export CSV
      </button>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowUpgradeModal(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Upgrade to PRO</h2>
                <p className="text-slate-600 mb-6">
                  CSV export is a PRO feature. Upgrade now to export your influencer data and unlock more features!
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowUpgradeModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpgrade}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Upgrade to PRO
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}


