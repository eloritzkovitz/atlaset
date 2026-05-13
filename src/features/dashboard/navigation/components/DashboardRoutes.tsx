import { Navigate, Route, Routes } from "react-router-dom";
import type { Country, Currency } from "@features/countries";
import type { Language } from "@types";
import { AchievementsGrid } from "../../achievements/components/AchievementsGrid";
import { AchievementInfo } from "../../achievements/components/AchievementInfo";
import { CurrencyExchangeWidget } from "../../currencies/components/CurrencyExchangeWidget";
import { CurrenciesGrid } from "../../currencies/components/CurrenciesGrid";
import { CurrencyInfo } from "../../currencies/components/CurrencyInfo";
import { CountryStats } from "../../exploration/components/CountryStats";
import { LanguagesGrid } from "../../languages/components/LanguagesGrid";
import { LanguageInfo } from "../../languages/components/LanguageInfo";
import { OverviewGrid } from "../../overview/components/OverviewGrid";
import { StatisticsGrid } from "../../statistics/components/StatisticsGrid";

interface DashboardRoutesProps {
  countries: Country[];
  currencies: Currency[];
  languages: Language[];
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedSubregion: string;
  setSelectedSubregion: (subregion: string) => void;
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
}: DashboardRoutesProps) {
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
        path="countries"
        element={<Navigate to="/dashboard/exploration" replace />}
      />
      <Route
        path="exploration"
        element={
          <CountryStats
            {...countryStatsBaseProps}
            selectedRegion={selectedRegion}
            selectedSubregion={selectedSubregion}
            search={search}
            selectedIsoCode={selectedIsoCode}
            onSubregionChange={handleSubregionChange}
            onBack={undefined}
          />
        }
      />
      <Route
        path="countries/all"
        element={
          <CountryStats
            {...countryStatsBaseProps}
            selectedRegion={"all"}
            selectedSubregion={""}
            search={search}
            selectedIsoCode={""}
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
            search={search}
            selectedIsoCode={selectedIsoCode}
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
        path="currencies/"
        element={<CurrenciesGrid currencies={currencies} />}
      />
      <Route
        path="currencies/:code"
        element={
          <CurrencyInfo
            currency={currencies.find(
              (c) =>
                c.code === (window.location.pathname.split("/").pop() || ""),
            )}
            countries={countries}
          />
        }
      />
      <Route
        path="languages/"
        element={<LanguagesGrid languages={languages} />}
      />
      <Route
        path="languages/:code"
        element={
          <LanguageInfo
            language={languages.find(
              (l) =>
                l.code === (window.location.pathname.split("/").pop() || ""),
            )}
            countries={countries}
          />
        }
      />
      <Route path="achievements" element={<AchievementsGrid />} />
      <Route path="achievements/:achievementId" element={<AchievementInfo />} />
      <Route path="statistics/*" element={<StatisticsGrid />} />
    </Routes>
  );
}
