import { useLocation } from "react-router-dom";
import { useGetAchievementsQuery } from "@features/achievements";
import { parseDashboardPath } from "../utils/dashboardNavigation";

/**
 * Manages dashboard route state.
 */
export function useDashboardRouteState() {
  const location = useLocation();
  const { data: achievements } = useGetAchievementsQuery();

  const { selectedPanel, menuSelectedPanel, entityId } = parseDashboardPath(
    location.pathname,
  );

  const selectedAchievement =
    menuSelectedPanel === "achievements" && entityId
      ? (achievements?.find((a) => a.id === entityId) ?? null)
      : null;

  return {
    selectedPanel,
    menuSelectedPanel,
    selectedAchievement,
  };
}
