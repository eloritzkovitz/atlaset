import { useState } from "react";
import { SegmentedToggle } from "@components";
import { useCountryData } from "@contexts/CountryDataContext";
import { useVisitedCountries } from "@features/visits";
import { useDelayedLoading } from "@hooks/useDelayedLoading";
import { RegionCard } from "./RegionCard";
import { WorldExplorationCard } from "./WorldExplorationCard";
import { useExplorationStats } from "../hooks/useExplorationStats";

export function ExplorationStats() {
  const { countries, loading: countriesLoading } = useCountryData();
  const visited = useVisitedCountries();

  // Add toggle state
  const [countryType, setCountryType] = useState<"all" | "sovereign">("all");

  // Filter countries based on toggle
  const filteredCountries =
    countryType === "sovereign"
      ? countries.filter((c) => c.sovereigntyType === "Sovereign")
      : countries;

  const loading = useDelayedLoading(
    countriesLoading || !countries.length,
    [countries.length],
    50
  );

  // Compute exploration stats
  const { totalCountries, visitedCountries, regionStats } = useExplorationStats(
    filteredCountries,
    visited
  );

  return (
    <>
      <SegmentedToggle
        value={countryType}
        options={[
          { value: "all", label: "All Countries" },
          { value: "sovereign", label: "Sovereign Only" },
        ]}
        onChange={setCountryType}
        className="mb-4"
      />
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
