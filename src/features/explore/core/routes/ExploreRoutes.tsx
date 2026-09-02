import { Navigate, Route, Routes } from "react-router-dom";
import type { Country, Currency, Timezone } from "@features/countries/types";
import type { Language } from "@types";
import type {
  CountryNavigationScope,
  ExploreCountryViewControls,
} from "../types";
import { AchievementsGrid } from "../../achievements/AchievementsGrid";
import { AchievementInfo } from "../../achievements/AchievementInfo";
import { CountryStats } from "../../countries/components/CountryStats";
import { CurrencyExchangeWidget } from "../../currencies/components/CurrencyExchangeWidget";
import { CurrenciesGrid } from "../../currencies/components/CurrenciesGrid";
import { CurrencyInfo } from "../../currencies/components/CurrencyInfo";
import { ExploreDiscoverGrid } from "../../discover/components/ExploreDiscoverGrid";
import { LanguagesGrid } from "../../languages/components/LanguagesGrid";
import { LanguageInfo } from "../../languages/components/LanguageInfo";
import { ExploreProgressGrid } from "../../progress/components/ExploreProgressGrid";
import { useExplorationStats } from "../../progress/hooks/useExplorationStats";
import { TimezonesGrid } from "../../timezones/components/TimezonesGrid";
import { TimezoneInfo } from "../../timezones/components/TimezoneInfo";

interface ExploreRoutesProps extends ExploreCountryViewControls {
  countries: Country[];
  currencies: Currency[];
  languages: Language[];
  timezones: Timezone[];
  selectedIsoCode: string;
  countryNavigationScope: CountryNavigationScope;
  setSelectedIsoCode: (isoCode: string | null) => void;
  onSubregionChange: (region: string, subregion: string) => void;
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
  showVisitedOnly,
  setShowVisitedOnly,
  showTranscontinental,
  setShowTranscontinental,
  search,
  setSearch,
  selectedIsoCode,
  setSelectedIsoCode,
  onShowAllCountries,
  onSubregionChange,
  resetFilters,
  onBack,
  countryNavigationScope,
}: ExploreRoutesProps) {
  const countryStatsBaseProps = {
    search,
    setSearch,
    setSelectedRegion,
    setSelectedSubregion,
    setSelectedSovereignOnly,
    selectedSovereignOnly,
    showVisitedOnly,
    setShowVisitedOnly,
    showTranscontinental,
    setShowTranscontinental,
    setSelectedIsoCode,
    onShowAllCountries,
    resetFilters,
  };

  const { totalCountries, visitedCountries, regionStats } = useExplorationStats(
    countries,
    selectedSovereignOnly,
  );

  const handleSubregionChange = (region: string, subregion: string) => {
    setSelectedRegion(region);
    setSelectedSubregion(subregion);
    onSubregionChange(region, subregion);
  };

  return (
    <Routes>
      <Route
        path="progress"
        element={
          <ExploreProgressGrid
            visitedCountries={visitedCountries}
            totalCountries={totalCountries}
            regionStats={regionStats}
            selectedSovereignOnly={selectedSovereignOnly}
            setSelectedSovereignOnly={setSelectedSovereignOnly}
            setSelectedRegion={setSelectedRegion}
            setSelectedSubregion={setSelectedSubregion}
            onSubregionChange={handleSubregionChange}
            onShowAllCountries={onShowAllCountries}
          />
        }
      />
      <Route path="" element={<Navigate to="progress" replace />} />

      <Route path="discover" element={<ExploreDiscoverGrid />} />

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
            selectedIsoCode=""
            selectedSovereignOnly={selectedSovereignOnly}
            countryNavigationScope={countryNavigationScope}
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
            selectedIsoCode={selectedIsoCode}
            countryNavigationScope={countryNavigationScope}
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
    </Routes>
  );
}
