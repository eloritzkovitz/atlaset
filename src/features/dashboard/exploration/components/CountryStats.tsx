import { useState } from "react";
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
import { DashboardHeader } from "../../navigation/components/DashboardHeader";

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
  onSubregionChange?: (region: string, subregion: string) => void;
  onResetFilters?: () => void;
  onBack?: () => void;
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
  onSubregionChange,
  onResetFilters,
  onBack,
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
        <DashboardHeader
          title={selectedCountry.name}
          subtitle={`(${selectedCountry.isoCode})`}
          onBack={onBack}
          leading={
            <span className={`${isMobile ? "" : "mb-2"}`}>
              <CountryFlag
                flag={{
                  isoCode: selectedCountry.isoCode,
                  sovereignState: selectedCountry.sovereignState,
                  ratio: "3x2",
                  size: `${isMobile ? "32" : "64"}`,
                }}
              />
            </span>
          }
          actions={
            <VisitedStatusIndicator
              visited={visited.isCountryVisited(selectedCountry.isoCode)}
              isHome={selectedCountry.isoCode === homeCountry}
            />
          }
        />
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
        countries={countries}
        visitedCountryCodes={visited.visitedCountryCodes}
        onSubregionChange={onSubregionChange}
        onAllCountries={onShowAllCountries}
        initialSovereignOnly={countryType === "sovereign"}
        resetFilters={onResetFilters}
        {...regionProps}
      />
    );
  }
}
