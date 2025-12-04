import { useState } from "react";
import { ErrorMessage, LoadingSpinner } from "@components";
import { useCountryData } from "@contexts/CountryDataContext";
import {
  DashboardPanelMenu,
  ExplorationStats,
  TripHistory,
  TripsByMonth,
  TripsByYear,
  TripsStats,
} from "@features/dashboard";
import { PANEL_BREADCRUMBS } from "@features/dashboard/menu/menu";

export default function DashboardPage() {
  const [selectedPanel, setSelectedPanel] = useState("exploration");
  const { loading, error } = useCountryData();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <ErrorMessage error={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-4 max-w-6xl mx-auto flex gap-6">
        <DashboardPanelMenu
          selectedPanel={selectedPanel}
          setSelectedPanel={setSelectedPanel}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-6">
            {PANEL_BREADCRUMBS[selectedPanel]?.map((crumb, idx, arr) => (
              <span key={idx} className="flex items-center">
                {crumb.key ? (
                  <button
                    className="text-gray-100 hover:underline font-bold"
                    onClick={() => setSelectedPanel(crumb.key!)}
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span className="text-gray-400 font-bold">{crumb.label}</span>
                )}
                {idx < arr.length - 1 && (
                  <span className="mx-2 text-gray-400">/</span>
                )}
              </span>
            ))}
          </div>
          {selectedPanel === "exploration" && <ExplorationStats />}
          {selectedPanel === "trips-overview" && <TripsStats />}
          {selectedPanel === "trips-history" && <TripHistory />}
          {selectedPanel === "trips-month" && <TripsByMonth />}
          {selectedPanel === "trips-year" && <TripsByYear />}
        </div>
      </div>
    </div>
  );
}
