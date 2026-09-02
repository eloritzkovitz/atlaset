import { useLocation } from "react-router-dom";
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
import { getCountryNavigation } from "../utils/countryNavigation";
import { ExploreHeader } from "../../core/components/ExploreHeader";
import { WikipediaButton } from "../../core/components/WikipediaButton";
import { useExploreNavigation } from "../../core/hooks/useExploreNavigation";
import type { CountryNavigationScope } from "../../core/types";

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
  countryNavigationScope?: CountryNavigationScope;
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
  countryNavigationScope = "all",
  onShowAllCountries,
  onShowSovereignOnly,
  onSubregionChange,
  onResetFilters,
  onBack,
}: CountryStatsProps) {
  const location = useLocation();
  const { countries, countryByIsoCode, currencies } = useCountryData();
  const { navigateToCountry } = useExploreNavigation(countries);
  const { visitedCountryCodes, getCountryVisitsCategorized } =
    useCountryTracking();
  const { isMobile } = useScreenSize();

  const navigationState = location.state as {
    navigationCountryIsoCodes?: string[];
  } | null;

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

  const { previous: previousCountry, next: nextCountry } = getCountryNavigation(
    {
      countries,
      selectedIsoCode,
      scope: countryNavigationScope,
      region: selectedRegion,
      subregion: selectedSubregion,
      sovereignOnly: selectedShowSovereignOnly,
      search,
      navigationCountryIsoCodes: navigationState?.navigationCountryIsoCodes,
    },
  );

  if (selectedCountry) {
    return (
      <div>
        <ExploreHeader
          title={selectedCountry.name}
          subtitle={`(${selectedCountry.isoCode})`}
          onBack={onBack}
          navigation={{
            previous: previousCountry
              ? {
                  label: previousCountry.name,
                  icon: (
                    <CountryFlag
                      flag={{
                        isoCode: previousCountry.isoCode,
                        sovereignState: previousCountry.sovereignState,
                        ratio: "3x2",
                        size: "24",
                      }}
                    />
                  ),
                  onClick: () => navigateToCountry(previousCountry.isoCode),
                }
              : undefined,
            next: nextCountry
              ? {
                  label: nextCountry.name,
                  icon: (
                    <CountryFlag
                      flag={{
                        isoCode: nextCountry.isoCode,
                        sovereignState: nextCountry.sovereignState,
                        ratio: "3x2",
                        size: "24",
                      }}
                    />
                  ),
                  onClick: () => navigateToCountry(nextCountry.isoCode),
                }
              : undefined,
          }}
          leading={
            <span className={isMobile ? "" : "mb-2"}>
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
              <WikipediaButton searchTerm={selectedCountry.name} />
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

  return null;
}
