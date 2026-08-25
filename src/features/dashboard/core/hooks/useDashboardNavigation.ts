import { useNavigate } from "react-router-dom";
import { DASHBOARD_URLS } from "../../core/constants/dashboardMenu";

/**
 * Manages dashboard navigation state and handlers.
 */
export function useDashboardNavigation() {
  const navigate = useNavigate();

  const handlePanelChange = (panel: string) => {
    navigate(`/dashboard/${panel}`);
  };

  const handleCrumbClick = (key: string) => {
    const crumbActions: Record<string, () => void> = {
      dashboard: () => navigate(DASHBOARD_URLS.overview),
      achievements: () => navigate(DASHBOARD_URLS.achievements),
      statistics: () => navigate(DASHBOARD_URLS.statistics),
    };

    const action = crumbActions[key];

    if (action) {
      action();
      return;
    }

    handlePanelChange(key);
  };

  return {
    handlePanelChange,
    handleCrumbClick,
  };
}
