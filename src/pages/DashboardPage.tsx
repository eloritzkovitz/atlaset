import { useState } from "react";
import { ErrorMessage, LoadingSpinner } from "@components";
import { useCountryData } from "@contexts/CountryDataContext";
import { DashboardPanelMenu, ExplorationStats, TripsStats } from "@features/dashboard";

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
      <div className="p-6 max-w-4xl mx-auto flex gap-6">
        <DashboardPanelMenu
          selectedPanel={selectedPanel}
          setSelectedPanel={setSelectedPanel}
        />
        <div className="flex-1">
          {selectedPanel === "exploration" && <ExplorationStats />}
          {selectedPanel === "trips" && <TripsStats />}
        </div>
      </div>
    </div>
  );
}
