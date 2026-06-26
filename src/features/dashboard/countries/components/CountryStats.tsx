import {
  CountryDetailsPanel,
  CountryFlag,
  VisitedStatusIndicator,
  useCountryData,
} from "@features/countries";
import { useVisitedCountries } from "@features/visits";
import { useScreenSize } from "@hooks";
import { CountrySection } from "./CountrySection";
import { DashboardHeader } from "../../navigation/components/DashboardHeader";

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
  const { countries, currencies } = useCountryData();
  const { visitedCountryCodes, getCountryVisitsCategorized } =
    useVisitedCountries();
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

  // Find selected country details
  const selectedCountry = countries.find((c) => c.isoCode === selectedIsoCode);

  // Get categorized visits for selected country
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
          actions={<VisitedStatusIndicator country={selectedCountry} />}
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
