import { Route, Routes } from "react-router-dom";
import { DashboardOverview } from "../components/DashboardOverview";
import { StatisticsGrid } from "../../statistics/components/StatisticsGrid";

export function DashboardRoutes() {
  return (
    <Routes>
      <Route path="" element={<DashboardOverview />} />
      <Route path="statistics/*" element={<StatisticsGrid />} />
    </Routes>
  );
}
