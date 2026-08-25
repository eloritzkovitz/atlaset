import { useTranslation } from "react-i18next";
import { Navigate, useLocation } from "react-router-dom";
import {
  Breadcrumbs,
  Container,
  HamburgerButton,
  LoadingSpinner,
} from "@components";
import { useAuth } from "@features/user/auth";
import { useDisclosure, usePageTitle, useScreenSize } from "@hooks";
import { DashboardPanelMenu } from "../components/DashboardPanelMenu";
import { useDashboardNavigation } from "../hooks/useDashboardNavigation";
import { useDashboardRouteState } from "../hooks/useDashboardRouteState";
import { DashboardRoutes } from "../routes/DashboardRoutes";
import { getDashboardBreadcrumbs } from "../utils/dashboardNavigation";

export default function DashboardPage() {
  const location = useLocation();
  const { ready } = useAuth();
  const { isMobile } = useScreenSize();
  const { t: tDashboard } = useTranslation("dashboard");

  const panelMenu = useDisclosure();

  const { selectedPanel, menuSelectedPanel, selectedAchievement } =
    useDashboardRouteState();

  const breadcrumbs = getDashboardBreadcrumbs({
    selectedPanel,
    selectedAchievement: selectedAchievement?.name ?? null,
  });

  const translatedBreadcrumbs = breadcrumbs.map((crumb) => ({
    ...crumb,
    label: crumb.labelKey
      ? tDashboard(crumb.labelKey)
      : (crumb.label ?? crumb.key ?? ""),
  }));

  const isAchievementPanel = selectedPanel?.startsWith("achievements");

  const pageTitle =
    isAchievementPanel && selectedAchievement?.name
      ? selectedAchievement.name
      : selectedPanel
        ? tDashboard(`menu.${selectedPanel}`)
        : tDashboard("menu.title");

  usePageTitle(pageTitle);

  const { handlePanelChange, handleCrumbClick } = useDashboardNavigation();

  if (!ready) {
    return <LoadingSpinner fullScreen message="Loading dashboard..." />;
  }

  if (location.pathname === "/dashboard") {
    return <Navigate to="/dashboard/overview" replace />;
  }

  return (
    <div className="relative min-h-screen">
      {isMobile && (
        <>
          <HamburgerButton onClick={panelMenu.open} />

          <DashboardPanelMenu
            open={panelMenu.isOpen}
            onClose={panelMenu.close}
            selectedPanel={menuSelectedPanel}
            setSelectedPanel={handlePanelChange}
          />
        </>
      )}

      <Container>
        {!isMobile && (
          <DashboardPanelMenu
            selectedPanel={menuSelectedPanel}
            setSelectedPanel={handlePanelChange}
          />
        )}

        <div className="mt-12 min-w-0 flex-1">
          <Breadcrumbs
            crumbs={translatedBreadcrumbs}
            onCrumbClick={handleCrumbClick}
          />

          <DashboardRoutes />
        </div>
      </Container>
    </div>
  );
}
