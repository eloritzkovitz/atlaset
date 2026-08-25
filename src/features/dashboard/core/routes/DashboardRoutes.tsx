import { Navigate, Route, Routes } from "react-router-dom";
import { AchievementsGrid } from "../../achievements/AchievementsGrid";
import { AchievementInfo } from "../../achievements/AchievementInfo";
import { OverviewGrid } from "../../overview/OverviewGrid";
import { StatisticsGrid } from "../../statistics/components/StatisticsGrid";

export function DashboardRoutes() {
  return (
    <Routes>
      <Route path="overview" element={<OverviewGrid />} />
      <Route path="" element={<Navigate to="overview" replace />} />

      <Route path="achievements" element={<AchievementsGrid />} />
      <Route path="achievements/:achievementId" element={<AchievementInfo />} />

      <Route path="statistics/*" element={<StatisticsGrid />} />
    </Routes>
  );
}
