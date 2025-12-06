import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { SegmentedToggle } from "@components";
import { useCountryData } from "@contexts/CountryDataContext";
import { CountryDetailsContent, VisitedStatusIndicator } from "@features/countries";
import { useHomeCountry } from "@features/settings";
import { useVisitedCountries } from "@features/visits";
import { useDelayedLoading } from "@hooks/useDelayedLoading";
import { CountrySection } from "./CountrySection";
import { RegionCard } from "./RegionCard";
import { WorldExplorationCard } from "./WorldExplorationCard";
import { useExplorationStats } from "../hooks/useExplorationStats";

interface CountryStatsProps {
  selectedRegion: string | null;
  setSelectedRegion: (region: string) => void;
  selectedSubregion: string | null;
  setSelectedSubregion: (region: string, subregion: string) => void;
  selectedIsoCode: string | null;
  setSelectedIsoCode: (isoCode: string | null) => void;
  onShowAllCountries: () => void;
}

export function CountryStats({
  selectedRegion,
  setSelectedRegion,
  selectedSubregion,
  setSelectedSubregion,
  selectedIsoCode,
  setSelectedIsoCode,
  onShowAllCountries,
}: CountryStatsProps) {
  const { countries, loading: countriesLoading, currencies } = useCountryData();
  const { homeCountry } = useHomeCountry();
  const visited = useVisitedCountries();

  // Toggle state for country type and view mode
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

  const selectedCountry = countries.find((c) => c.isoCode === selectedIsoCode);

  // If a country is selected, show its details
  if (selectedCountry) {
    return (
      <div>
        <button
          onClick={() => setSelectedIsoCode(null)}
          className="mb-4 flex items-center gap-2 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <FaArrowLeft className="text-base" />
          Back
        </button>
        <span className="flex items-center gap-4 mb-4">
          <h1 className="text-2xl font-bold mb-4">{selectedCountry.name}</h1>
          <VisitedStatusIndicator
            visited={visited.isCountryVisited(selectedCountry.isoCode)}
            isHome={!!homeCountry}
          />
        </span>
        <CountryDetailsContent
          country={selectedCountry}
          currencies={currencies}
        />
      </div>
    );
  }

  // If showing all countries (world view)
  if (selectedRegion === "All Countries") {
    return (
      <CountrySection
        countries={filteredCountries}
        visitedCountryCodes={visited.visitedCountryCodes}
        selectedIsoCode={selectedIsoCode}
        setSelectedIsoCode={setSelectedIsoCode}
      />
    );
  }

  // If a region is selected, show country grid for region or subregion
  if (selectedRegion) {
    const region = regionStats.find((r) => r.region === selectedRegion);
    if (!region) return null;

    const countriesToShow = selectedSubregion
      ? region.regionCountries.filter((c) => c.subregion === selectedSubregion)
      : region.regionCountries;

    return (
      <CountrySection
        countries={countriesToShow}
        visitedCountryCodes={visited.visitedCountryCodes}
        selectedIsoCode={selectedIsoCode}
        setSelectedIsoCode={setSelectedIsoCode}
      />
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
        onShowAllCountries={onShowAllCountries}
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
            onRegionClick={() => setSelectedRegion(region.region)}
            onSubregionClick={(sub) => setSelectedSubregion(region.region, sub)}
          />
        ))}
      </div>
    </>
  );
}
