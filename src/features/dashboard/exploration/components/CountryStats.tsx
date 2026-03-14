import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import {
  CountryDetailsPanel,
  CountryFlag,
  VisitedStatusIndicator,
  createSovereigntyFilter,
  useCountryData,
} from "@features/countries";
import { useHomeCountry } from "@features/user";
import { useVisitedCountries } from "@features/visits";
import { useScreenSize } from "@hooks";
import { CountrySection } from "./CountrySection";
import { ExplorationOverviewGrid } from "./ExplorationOverviewGrid";
import { useExplorationStats } from "../hooks/useExplorationStats";
import { type CountryType } from "../types";

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
  const { countries, currencies } = useCountryData();
  const { homeCountry } = useHomeCountry();
  const visited = useVisitedCountries();
  const [countryType, setCountryType] = useState<CountryType>("all");
  const { isMobile } = useScreenSize();

  // Region props shared between overview and section views
  const regionProps = {
    selectedRegion: selectedRegion ?? "",
    setSelectedRegion,
    selectedSubregion: selectedSubregion ?? "",
    setSelectedSubregion,
    search,
    setSearch,
    selectedIsoCode: selectedIsoCode ?? null,
    setSelectedIsoCode,
  };

  // Filter countries based on toggle
  const filteredCountries =
    countryType === "sovereign"
      ? countries.filter(createSovereigntyFilter(true))
      : countries;

  // Compute exploration stats
  const { totalCountries, visitedCountries, regionStats } =
    useExplorationStats(filteredCountries);

  // Find selected country details
  const selectedCountry = countries.find((c) => c.isoCode === selectedIsoCode);

  // Get categorized visits for selected country
  const categorizedVisits = selectedCountry
    ? visited.getCountryVisitsCategorized(selectedCountry.isoCode)
    : { past: [], upcoming: [], tentative: [] };

  // If a country is selected, show its details
  if (selectedCountry) {
    return (
      <div>
        <span className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 hover:text-muted"
          >
            <FaArrowLeft className="text-xl" />
          </button>
          <span className={`${isMobile ? "" : "mb-2"}`}>
            <CountryFlag
              flag={{
                isoCode: selectedCountry.isoCode,
                ratio: "3x2",
                size: `${isMobile ? "32" : "64"}`,
              }}
            />
          </span>
          <h1 className={`!text-${isMobile ? "2xl" : "4xl mb-4"} font-bold`}>
            {selectedCountry.name}
          </h1>
          <span className={`text-${isMobile ? "sm" : "2xl mb-2"} text-muted`}>
            ({selectedCountry.isoCode})
          </span>
          <VisitedStatusIndicator
            visited={visited.isCountryVisited(selectedCountry.isoCode)}
            isHome={selectedCountry.isoCode === homeCountry}
          />
        </span>
        <CountryDetailsPanel
          country={selectedCountry}
          currencies={currencies}
          categorizedVisits={categorizedVisits}
          onSelectCountry={setSelectedIsoCode}
          className="text-lg"
        />
      </div>
    );
  }

  // If no region is selected, show overview grid
  if (selectedRegion === undefined || selectedRegion === "") {
    return (
      <ExplorationOverviewGrid
        countryType={countryType}
        setCountryType={setCountryType}
        visitedCountries={visitedCountries}
        totalCountries={totalCountries}
        onShowAllCountries={onShowAllCountries}
        regionStats={regionStats}
        onSubregionChange={onSubregionChange}
        {...regionProps}
      />
    );
  }

  // If a region is selected, show country grid for region or subregion
  if (selectedRegion) {
    return (
      <CountrySection
        countries={filteredCountries}
        visitedCountryCodes={visited.visitedCountryCodes}
        onSubregionChange={onSubregionChange}
        onAllCountries={onShowAllCountries}
        resetFilters={resetFilters}
        {...regionProps}
      />
    );
  }
}
