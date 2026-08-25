import { Navigate, Route, Routes } from "react-router-dom";
import type { Country, Currency, Timezone } from "@features/countries/types";
import type { Language } from "@types";
import { CountryStats } from "../../../explore/countries/components/CountryStats";
import { CurrencyExchangeWidget } from "../../currencies/components/CurrencyExchangeWidget";
import { CurrenciesGrid } from "../../currencies/components/CurrenciesGrid";
import { CurrencyInfo } from "../../currencies/components/CurrencyInfo";
import { LanguagesGrid } from "../../languages/components/LanguagesGrid";
import { LanguageInfo } from "../../languages/components/LanguageInfo";
import { ExploreOverviewGrid } from "../../overview/components/ExploreOverviewGrid";
import { useExplorationStats } from "../../overview/hooks/useExplorationStats";
import { TimezonesGrid } from "../../timezones/components/TimezonesGrid";
import { TimezoneInfo } from "../../timezones/components/TimezoneInfo";

interface ExploreRoutesProps {
  countries: Country[];
  currencies: Currency[];
  languages: Language[];
  timezones: Timezone[];
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedSubregion: string;
  setSelectedSubregion: (subregion: string) => void;
  selectedSovereignOnly: boolean;
  setSelectedSovereignOnly: (v: boolean) => void;
  search: string;
  setSearch: (search: string) => void;
  selectedIsoCode: string;
  setSelectedIsoCode: (isoCode: string | null) => void;
  onShowAllCountries: () => void;
  onSubregionChange: (region: string, subregion: string) => void;
  onResetFilters: () => void;
  onBack: () => void;
}

export function ExploreRoutes({
  countries,
  currencies,
  languages,
  timezones,
  selectedRegion,
  setSelectedRegion,
  selectedSubregion,
  setSelectedSubregion,
  selectedSovereignOnly,
  setSelectedSovereignOnly,
  search,
  setSearch,
  selectedIsoCode,
  setSelectedIsoCode,
  onShowAllCountries,
  onSubregionChange,
  onResetFilters,
  onBack,
}: ExploreRoutesProps) {
  const countryStatsBaseProps = {
    setSelectedRegion,
    setSelectedSubregion,
    setSearch,
    setSelectedIsoCode,
    onShowAllCountries,
    onResetFilters,
  };

  const { totalCountries, visitedCountries, regionStats } = useExplorationStats(
    countries,
    selectedSovereignOnly,
  );

  // Subregion selection handler
  const handleSubregionChange = (region: string, subregion: string) => {
    setSelectedRegion(region);
    setSelectedSubregion(subregion);
    onSubregionChange(region, subregion);
  };

  return (
    <Routes>
      <Route
        path="overview"
        element={
          <ExploreOverviewGrid
            visitedCountries={visitedCountries}
            totalCountries={totalCountries}
            regionStats={regionStats}
            selectedShowSovereignOnly={selectedSovereignOnly}
            setSelectedShowSovereignOnly={setSelectedSovereignOnly}
            setSelectedRegion={setSelectedRegion}
            setSelectedSubregion={setSelectedSubregion}
            onSubregionChange={handleSubregionChange}
            onShowAllCountries={onShowAllCountries}
          />
        }
      />
      <Route path="" element={<Navigate to="overview" replace />} />

      <Route
        path="countries"
        element={<Navigate to="/explore/countries/all" replace />}
      />
      <Route
        path="countries/all"
        element={
          <CountryStats
            {...countryStatsBaseProps}
            selectedRegion="all"
            selectedSubregion=""
            search={search}
            selectedIsoCode=""
            selectedShowSovereignOnly={selectedSovereignOnly}
            onShowSovereignOnly={setSelectedSovereignOnly}
            onSubregionChange={handleSubregionChange}
            onBack={undefined}
          />
        }
      />
      <Route
        path="countries/:region/:subregion?/:isoCode?"
        element={
          <CountryStats
            {...countryStatsBaseProps}
            selectedRegion={selectedRegion}
            selectedSubregion={selectedSubregion}
            selectedShowSovereignOnly={selectedSovereignOnly}
            search={search}
            selectedIsoCode={selectedIsoCode}
            onShowSovereignOnly={setSelectedSovereignOnly}
            onSubregionChange={handleSubregionChange}
            onBack={onBack}
          />
        }
      />

      <Route
        path="currencies/exchange"
        element={<CurrencyExchangeWidget currencies={currencies} />}
      />
      <Route
        path="currencies"
        element={<CurrenciesGrid currencies={currencies} />}
      />
      <Route
        path="currencies/:code"
        element={<CurrencyInfo currencies={currencies} countries={countries} />}
      />

      <Route
        path="languages"
        element={<LanguagesGrid languages={languages} />}
      />
      <Route
        path="languages/:code"
        element={<LanguageInfo languages={languages} countries={countries} />}
      />

      <Route
        path="timezones"
        element={<TimezonesGrid timezones={timezones} />}
      />
      <Route
        path="timezones/:code"
        element={<TimezoneInfo timezones={timezones} countries={countries} />}
      />
    </Routes>
  );
}
