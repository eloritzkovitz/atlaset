import {
  CountryDetailsPanel,
  CountryFlag,
  VisitedStatusIndicator,
  useCountryData,
} from "@features/countries";
import type { CountryDetailsTab } from "@features/countries/types";
import { useCountryTracking } from "@features/visits";
import { useQueryParam, useScreenSize } from "@hooks";
import { CountrySection } from "./CountrySection";
import { DashboardHeader } from "../../core/components/DashboardHeader";
import { WikipediaButton } from "../../core/components/WikipediaButton";

interface CountryStatsProps {
  selectedRegion?: string;
  setSelectedRegion: (region: string) => void;
  selectedSubregion?: string;
  setSelectedSubregion: (subregion: string) => void;
  selectedShowSovereignOnly?: boolean;
  search: string;
  setSearch: (search: string) => void;
  selectedIsoCode?: string;
  setSelectedIsoCode: (isoCode: string | null) => void;
  onShowAllCountries: () => void;
  onShowSovereignOnly?: (v: boolean) => void;
  onSubregionChange?: (region: string, subregion: string) => void;
  onResetFilters?: () => void;
  onBack?: () => void;
}

export function CountryStats({
  selectedRegion,
  setSelectedRegion,
  selectedSubregion,
  setSelectedSubregion,
  selectedShowSovereignOnly,
  search,
  setSearch,
  selectedIsoCode,
  setSelectedIsoCode,
  onShowAllCountries,
  onShowSovereignOnly,
  onSubregionChange,
  onResetFilters,
  onBack,
}: CountryStatsProps) {
  const { countries, countryByIsoCode, currencies } = useCountryData();
  const { visitedCountryCodes, getCountryVisitsCategorized } =
    useCountryTracking();
  const { isMobile } = useScreenSize();

  const [currentTab, handleTabChange] = useQueryParam<CountryDetailsTab>(
    "tab",
    "overview",
  );

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

  const selectedCountry = selectedIsoCode
    ? (countryByIsoCode[selectedIsoCode] ?? null)
    : null;

  const categorizedVisits = selectedCountry
    ? getCountryVisitsCategorized(selectedCountry.isoCode)
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
            <div className="flex items-center gap-2">
              <VisitedStatusIndicator country={selectedCountry} />
              <WikipediaButton searchTerm={`${selectedCountry.name}`} />
            </div>
          }
        />
        <CountryDetailsPanel
          country={selectedCountry}
          currencies={currencies}
          categorizedVisits={categorizedVisits}
          activeTab={currentTab}
          onTabChange={handleTabChange}
          onSelectCountry={setSelectedIsoCode}
          className="text-lg"
        />
      </div>
    );
  }

  // If a region is selected, show country grid for region or subregion
  if (selectedRegion) {
    return (
      <CountrySection
        countries={countries}
        visitedCountryCodes={visitedCountryCodes}
        onSubregionChange={onSubregionChange}
        onAllCountries={onShowAllCountries}
        selectedShowSovereignOnly={selectedShowSovereignOnly}
        onShowSovereignOnly={onShowSovereignOnly}
        resetFilters={onResetFilters}
        {...regionProps}
      />
    );
  }
}
