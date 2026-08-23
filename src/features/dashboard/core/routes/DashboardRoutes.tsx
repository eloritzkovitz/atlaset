import { Navigate, Route, Routes } from "react-router-dom";
import type { Country, Currency, Timezone } from "@features/countries/types";
import type { Language } from "@types";
import { AchievementsGrid } from "../../achievements/components/AchievementsGrid";
import { AchievementInfo } from "../../achievements/components/AchievementInfo";
import { CountryStats } from "../../countries/components/CountryStats";
import { CurrencyExchangeWidget } from "../../currencies/components/CurrencyExchangeWidget";
import { CurrenciesGrid } from "../../currencies/components/CurrenciesGrid";
import { CurrencyInfo } from "../../currencies/components/CurrencyInfo";
import { ExplorationOverviewGrid } from "../../exploration/components/ExplorationOverviewGrid";
import { useExplorationStats } from "../../exploration/hooks/useExplorationStats";
import { LanguagesGrid } from "../../languages/components/LanguagesGrid";
import { LanguageInfo } from "../../languages/components/LanguageInfo";
import { OverviewGrid } from "../../overview/OverviewGrid";
import { StatisticsGrid } from "../../statistics/components/StatisticsGrid";
import { TimezonesGrid } from "@features/dashboard/timezones/components/TimezonesGrid";
import { TimezoneInfo } from "@features/dashboard/timezones/components/TimezoneInfo";

interface DashboardRoutesProps {
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

export function DashboardRoutes({
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
}: DashboardRoutesProps) {
  const { totalCountries, visitedCountries, regionStats } = useExplorationStats(
    countries,
    selectedSovereignOnly,
  );

  const countryStatsBaseProps = {
    setSelectedRegion,
    setSelectedSubregion,
    setSearch,
    setSelectedIsoCode,
    onShowAllCountries,
    onResetFilters,
  };

  // Subregion selection handler
  const handleSubregionChange = (region: string, subregion: string) => {
    setSelectedRegion(region);
    setSelectedSubregion(subregion);
    onSubregionChange(region, subregion);
  };

  return (
    <Routes>
      <Route path="overview" element={<OverviewGrid />} />
      <Route path="" element={<Navigate to="overview" replace />} />

      <Route
        path="exploration"
        element={
          <ExplorationOverviewGrid
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

      <Route
        path="countries"
        element={<Navigate to="/dashboard/countries/all" replace />}
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

      <Route path="achievements" element={<AchievementsGrid />} />
      <Route path="achievements/:achievementId" element={<AchievementInfo />} />

      <Route path="statistics/*" element={<StatisticsGrid />} />
    </Routes>
  );
}
