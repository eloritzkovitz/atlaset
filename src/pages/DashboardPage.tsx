import { useState } from "react";
import { ErrorMessage, LoadingSpinner } from "@components";
import { useCountryData } from "@contexts/CountryDataContext";
import {
  DashboardPanelMenu,
  RegionCard,
  WorldExplorationCard,
  useExplorationStats,
} from "@features/dashboard";
import { useVisitedCountries } from "@features/visits";

export default function DashboardPage() {
  const [selectedPanel, setSelectedPanel] = useState("exploration");
  const { countries, loading, error } = useCountryData();
  const visited = useVisitedCountries();

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

  // Get exploration stats
  const { totalCountries, visitedCountries, regionStats } = useExplorationStats(
    countries,
    visited
  );

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="p-6 max-w-4xl mx-auto flex gap-6">
        <DashboardPanelMenu
          selectedPanel={selectedPanel}
          setSelectedPanel={setSelectedPanel}
        />
        <div className="flex-1">
          {selectedPanel === "exploration" && (
            <>
              <WorldExplorationCard
                visited={visitedCountries}
                total={totalCountries}
              />
              <div className="grid gap-6 md:grid-cols-2">
                {regionStats.map((region) => (
                  <RegionCard
                    key={region.region}
                    region={region.region}
                    visited={region.regionVisited}
                    total={region.regionCountries.length}
                    subregions={region.subregions}
                    countries={region.regionCountries}
                    visitedCountryCodes={visited.visitedCountryCodes}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
