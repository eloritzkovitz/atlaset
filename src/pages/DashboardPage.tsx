import { useState } from "react";
import { Breadcrumbs, type Crumb, ErrorMessage, LoadingSpinner } from "@components";
import { useCountryData } from "@contexts/CountryDataContext";
import {
  DashboardPanelMenu,
  CountryStats,
  TripHistory,
  TripsByMonth,
  TripsByYear,
  TripsStats,
} from "@features/dashboard";
import { PANEL_BREADCRUMBS } from "@features/dashboard/menu/menu";

export default function DashboardPage() {
  const [selectedPanel, setSelectedPanel] = useState("countries");
  const { loading, error } = useCountryData();

  // State for selected region and subregion
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedSubregion, setSelectedSubregion] = useState<string | null>(
    null
  );

  // Handle loading and error states
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  // Construct breadcrumbs
  const breadcrumbs: Crumb[] = [
    ...(PANEL_BREADCRUMBS[selectedPanel] || []),
    selectedRegion && { label: selectedRegion, key: "region" },
    selectedSubregion && { label: selectedSubregion, key: "countries" },
  ].filter(Boolean) as Crumb[];

  // Breadcrumb click handler
  const handleCrumbClick = (key: string) => {
    if (key === "countries") {
      setSelectedRegion(null);
      setSelectedSubregion(null);
    } else if (key === "region") {
      setSelectedSubregion(null);
    } else {
      handlePanelChange(key);
    }
  };

  // Reset region/subregion when switching panels
  const handlePanelChange = (key: string) => {
    setSelectedPanel(key);
    setSelectedRegion(null);
    setSelectedSubregion(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-4 max-w-6xl mx-auto flex gap-6">
        <DashboardPanelMenu
          selectedPanel={selectedPanel}
          setSelectedPanel={handlePanelChange}
        />
        <div className="flex-1">
          <Breadcrumbs crumbs={breadcrumbs} onCrumbClick={handleCrumbClick} />
          {selectedPanel === "countries" && (
            <CountryStats
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              selectedSubregion={selectedSubregion}
              setSelectedSubregion={setSelectedSubregion}
            />
          )}
          {selectedPanel === "trips-overview" && <TripsStats />}
          {selectedPanel === "trips-history" && <TripHistory />}
          {selectedPanel === "trips-month" && <TripsByMonth />}
          {selectedPanel === "trips-year" && <TripsByYear />}
        </div>
      </div>
    </div>
  );
}
