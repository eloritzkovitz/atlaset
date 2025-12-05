import { useEffect, useState } from "react";
import { useCountryData } from "@contexts/CountryDataContext";
import { useVisitedCountries } from "@features/visits";
import { RegionCard } from "./RegionCard";
import { WorldExplorationCard } from "./WorldExplorationCard";
import { useExplorationStats } from "../hooks/useExplorationStats";

export function ExplorationStats() {
  const { countries, loading: countriesLoading } = useCountryData();
  const visited = useVisitedCountries();
  const [showLoading, setShowLoading] = useState(true);

  // Manage loading state with a slight delay to prevent flickering
  useEffect(() => {
    if (!countriesLoading && countries.length) {
      const timer = setTimeout(() => setShowLoading(false), 50);
      return () => clearTimeout(timer);
    } else {
      setShowLoading(true);
    }
  }, [countriesLoading, countries.length]);

  const loading = countriesLoading || !countries.length || showLoading;

  // Get exploration stats
  const { totalCountries, visitedCountries, regionStats } = useExplorationStats(
    countries,
    visited
  );

  return (
    <>
      <WorldExplorationCard
        visited={visitedCountries}
        total={totalCountries}
        loading={loading}
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
            loading={loading}
          />
        ))}
      </div>
    </>
  );
}
