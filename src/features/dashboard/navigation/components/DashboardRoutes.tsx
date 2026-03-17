import { Navigate, Route, Routes, useParams } from "react-router-dom";
import type { Country, Currency } from "@features/countries";
import { AchievementsGrid } from "../../achievements/components/AchievementsGrid";
import { CurrencyExchangeWidget } from "../../currencies/components/CurrencyExchangeWidget";
import { CurrenciesGrid } from "../../currencies/components/CurrenciesGrid";
import { CurrencyInfo } from "../../currencies/components/CurrencyInfo";
import { CountryStats } from "../../exploration/components/CountryStats";
import { OverviewGrid } from "../../overview/components/OverviewGrid";
import { StatisticsGrid } from "../../statistics/components/StatisticsGrid";
import { AchievementInfo } from "@features/dashboard/achievements/components/AchievementInfo";
import { useAchievementsData } from "@features/dashboard/achievements/hooks/useAchievementsData";

interface DashboardRoutesProps {
  countries: Country[];
  currencies: Currency[];
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

  function AchievementInfoRoute({ countries }: { countries: Country[] }) {
    const { achievementId } = useParams();
    const { achievementsData } = useAchievementsData();
    const achievement = achievementsData?.find(
      (a) => String(a.id) === achievementId,
    );
    if (!achievement) return <div className="p-4">Achievement not found.</div>;
    return <AchievementInfo achievement={achievement} countries={countries} />;
  }

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
      <Route path="achievements" element={<AchievementsGrid />} />
      <Route
        path="achievements/:achievementId"
        element={<AchievementInfoRoute countries={countries} />}
      />
      <Route path="statistics/*" element={<StatisticsGrid />} />
    </Routes>
  );
}
