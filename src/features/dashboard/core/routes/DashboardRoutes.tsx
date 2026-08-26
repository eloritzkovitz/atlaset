import { Navigate, Route, Routes } from "react-router-dom";
import { OverviewGrid } from "../../overview/OverviewGrid";
import { StatisticsGrid } from "../../statistics/components/StatisticsGrid";

export function DashboardRoutes() {
  return (
    <Routes>
      <Route path="overview" element={<OverviewGrid />} />
      <Route path="" element={<Navigate to="overview" replace />} />

      <Route path="statistics/*" element={<StatisticsGrid />} />
    </Routes>
  );
}
