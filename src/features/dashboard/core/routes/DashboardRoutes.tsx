import { Navigate, Route, Routes } from "react-router-dom";
import type { Country } from "@features/countries/types";
import { AchievementsGrid } from "../../achievements/AchievementsGrid";
import { AchievementInfo } from "../../achievements/AchievementInfo";
import { ExplorationOverviewGrid } from "../../exploration/components/ExplorationOverviewGrid";
import { useExplorationStats } from "../../exploration/hooks/useExplorationStats";
import { OverviewGrid } from "../../overview/OverviewGrid";
import { StatisticsGrid } from "../../statistics/components/StatisticsGrid";

interface DashboardRoutesProps {
  countries: Country[];
  setSelectedRegion: (region: string) => void;
  setSelectedSubregion: (subregion: string) => void;
  selectedSovereignOnly: boolean;
  setSelectedSovereignOnly: (v: boolean) => void;
  setSelectedIsoCode: (isoCode: string | null) => void;
  onShowAllCountries: () => void;
  onSubregionChange: (region: string, subregion: string) => void;
}

export function DashboardRoutes({
  countries,
  setSelectedRegion,
  setSelectedSubregion,
  selectedSovereignOnly,
  setSelectedSovereignOnly,
  onShowAllCountries,
  onSubregionChange,
}: DashboardRoutesProps) {
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

      <Route path="achievements" element={<AchievementsGrid />} />
      <Route path="achievements/:achievementId" element={<AchievementInfo />} />

      <Route path="statistics/*" element={<StatisticsGrid />} />
    </Routes>
  );
}
