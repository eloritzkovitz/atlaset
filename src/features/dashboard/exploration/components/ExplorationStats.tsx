import { SegmentedToggle } from "@components";
import { useCountryData } from "@contexts/CountryDataContext";
import { useVisitedCountries } from "@features/visits";
import { useDelayedLoading } from "@hooks/useDelayedLoading";
import { RegionCard } from "./RegionCard";
import { WorldExplorationCard } from "./WorldExplorationCard";
import { useExplorationStats } from "../hooks/useExplorationStats";
import { SubregionCountryList } from "./SubregionCountryList";
import { useState } from "react";

interface ExplorationStatsProps {
  selectedRegion: string | null;
  setSelectedRegion: (r: string | null) => void;
  selectedSubregion: string | null;
  setSelectedSubregion: (s: string | null) => void;
}

export function ExplorationStats({
  selectedRegion,
  setSelectedRegion,
  selectedSubregion,
  setSelectedSubregion,
}: ExplorationStatsProps) {
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

  // If showing all countries (world view)
  if (selectedRegion === "All Countries") {
    return (
      <div>
        <SubregionCountryList
          countries={filteredCountries}
          visitedCountryCodes={visited.visitedCountryCodes}
        />
      </div>
    );
  }

  // If a region is selected, show country grid for region or subregion
  if (selectedRegion) {
    const region = regionStats.find((r) => r.region === selectedRegion);
    if (!region) return null;

    // If subregion selected, show only those countries
    const countriesToShow = selectedSubregion
      ? region.regionCountries.filter((c) => c.subregion === selectedSubregion)
      : region.regionCountries;

    return (
      <div>
        <SubregionCountryList
          countries={countriesToShow}
          visitedCountryCodes={visited.visitedCountryCodes}
        />
      </div>
    );
  }

  // Default: show region cards
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
        onShowAllCountries={() => {
          setSelectedRegion("All Countries");
          setSelectedSubregion(null);
        }}
      />
      <div className="grid gap-6 md:grid-cols-2">
        {regionStats.map((region) => (
          <RegionCard
            key={region.region}
            region={region.region}
            visited={region.regionVisited}
            total={region.regionCountries.length}
            subregions={region.subregions}
            loading={loading}
            onRegionClick={() => {
              setSelectedRegion(region.region);
              setSelectedSubregion(null);
            }}
            onSubregionClick={(sub) => {
              setSelectedRegion(region.region);
              setSelectedSubregion(sub);
            }}
          />
        ))}
      </div>
    </>
  );
}
