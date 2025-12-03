import { useState } from "react";
import { ErrorMessage, LoadingSpinner } from "@components";
import { useCountryData } from "@contexts/CountryDataContext";
import {
  DashboardPanelMenu,
  ExplorationStats,
  TripsByMonth,
  TripsStats,
} from "@features/dashboard";

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
    <div className="min-h-screen bg-white py-10">
      <div className="p-6 max-w-6xl mx-auto flex gap-6">
        <DashboardPanelMenu
          selectedPanel={selectedPanel}
          setSelectedPanel={setSelectedPanel}
        />
        <div className="flex-1">
          {selectedPanel === "exploration" && <ExplorationStats />}
          {selectedPanel === "trips-overview" && <TripsStats />}
          {selectedPanel === "trips-month" && <TripsByMonth />}
        </div>
      </div>
    </div>
  );
}
