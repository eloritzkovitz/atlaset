import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { Breadcrumbs, Container, LoadingSpinner } from "@components";
import { useAuth } from "@features/user/auth";
import { usePageTitle } from "@hooks";
import { DASHBOARD_URLS } from "../constants/dashboard";
import { DashboardRoutes } from "../routes/DashboardRoutes";
import {
  getDashboardBreadcrumbs,
  parseDashboardPath,
} from "../utils/dashboardNavigation";

export default function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { ready } = useAuth();
  const { t: tDashboard } = useTranslation("dashboard");

  const { section } = parseDashboardPath(location.pathname);

  const breadcrumbs = getDashboardBreadcrumbs({ section });

  const translatedBreadcrumbs = breadcrumbs.map((crumb) => ({
    ...crumb,
    label: crumb.labelKey
      ? tDashboard(crumb.labelKey)
      : (crumb.label ?? crumb.key ?? ""),
  }));

  const pageTitle = tDashboard(`menu.${section}`);

  usePageTitle(pageTitle);

  const handleCrumbClick = (key: string) => {
    switch (key) {
      case "dashboard":
        navigate(DASHBOARD_URLS.overview);
        break;
      case "statistics":
        navigate(DASHBOARD_URLS.statistics);
        break;
    }
  };

  if (!ready) {
    return <LoadingSpinner fullScreen message="Loading dashboard..." />;
  }

  return (
    <div className="relative min-h-screen">
      <Container>
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
