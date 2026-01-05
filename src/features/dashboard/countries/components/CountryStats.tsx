import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { SegmentedToggle } from "@components";
import {
  CountryDetailsContent,
  VisitedStatusIndicator,
  useCountryData,
} from "@features/countries";
import { useHomeCountry } from "@features/user";
import { useVisitedCountries } from "@features/visits";
import { useDelayedLoading } from "@hooks";
import { CountrySection } from "./CountrySection";
import { RegionCard } from "./RegionCard";
import { WorldExplorationCard } from "./WorldExplorationCard";
import { useExplorationStats } from "../hooks/useExplorationStats";

interface CountryStatsProps {
  selectedRegion?: string;
  setSelectedRegion: (region: string) => void;
  selectedSubregion?: string;
  setSelectedSubregion: (subregion: string) => void;
  search: string;
  setSearch: (search: string) => void;
  selectedIsoCode?: string;
  setSelectedIsoCode: (isoCode: string | null) => void;
  onShowAllCountries: () => void;
  onBack?: () => void;
  onSubregionChange?: (region: string, subregion: string) => void;
  resetFilters?: () => void;
}

export function CountryStats({
  selectedRegion,
  setSelectedRegion,
  selectedSubregion,
  setSelectedSubregion,
  search,
  setSearch,
  selectedIsoCode,
  setSelectedIsoCode,
  onShowAllCountries,
  onBack,
  onSubregionChange,
  resetFilters,
}: CountryStatsProps) {
  const { countries, loading: countriesLoading, currencies } = useCountryData();
  const { homeCountry } = useHomeCountry();
  const visited = useVisitedCountries();

  // Toggle state for country type and view mode (remains local, as it's not a filter prop)
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

  // Find selected country details
  const selectedCountry = countries.find((c) => c.isoCode === selectedIsoCode);

  // If a country is selected, show its details
  if (selectedCountry) {
    return (
      <div>
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-2 hover:text-muted"
        >
          <FaArrowLeft />
          Back
        </button>
        <span className="flex items-center gap-4 mb-4">
          <h1 className="text-2xl font-bold mb-4">{selectedCountry.name}</h1>
          <VisitedStatusIndicator
            visited={visited.isCountryVisited(selectedCountry.isoCode)}
            isHome={selectedCountry.isoCode === homeCountry}
          />
        </span>
        <CountryDetailsContent
          country={selectedCountry}
          currencies={currencies}
        />
      </div>
    );
  }

  // If no region is selected (overview), show region cards and toggles
  if (selectedRegion === undefined || selectedRegion === "") {
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
              onRegionClick={() => {
                setSelectedRegion(region.region);
                setSelectedSubregion("");
              }}
              onSubregionClick={(sub) => {
                setSelectedRegion(region.region);
                setSelectedSubregion(sub);
                if (onSubregionChange) {
                  onSubregionChange(region.region, sub);
                }
              }}
            />
          ))}
        </div>
      </>
    );
  }

  // If a region is selected, show country grid for region or subregion
  if (selectedRegion) {
    return (
      <CountrySection
        countries={filteredCountries}
        visitedCountryCodes={visited.visitedCountryCodes}
        selectedIsoCode={selectedIsoCode ?? null}
        setSelectedIsoCode={setSelectedIsoCode}
        selectedRegion={selectedRegion ?? ""}
        setSelectedRegion={setSelectedRegion}
        selectedSubregion={selectedSubregion ?? ""}
        setSelectedSubregion={setSelectedSubregion}
        search={search}
        setSearch={setSearch}
        onSubregionChange={onSubregionChange}
        onAllCountries={onShowAllCountries}
        resetFilters={resetFilters}
      />
    );
  }
}
