import { useLocation } from "react-router-dom";
import { parseDashboardPath } from "../utils/dashboardNavigation";

/**
 * Manages dashboard route state.
 */
export function useDashboardRouteState() {
  const location = useLocation();

  const { selectedPanel, menuSelectedPanel } = parseDashboardPath(
    location.pathname,
  );

  return {
    selectedPanel,
    menuSelectedPanel,
  };
}
