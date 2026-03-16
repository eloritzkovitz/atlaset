import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  Breadcrumbs,
  ErrorMessage,
  LoadingSpinner,
  HamburgerButton,
} from "@components";
import { useCountryData, useRegionSubregionFilters } from "@features/countries";
import {
  DASHBOARD_MENU,
  DashboardPanelMenu,
  DashboardRoutes,
  useDashboardRouteState,
  useDashboardNavigation,
  getDashboardMeta,
} from "@features/dashboard";
import { useAuth } from "@features/user";
import { usePageTitle, useScreenSize } from "@hooks";
import { isWindowDefined } from "@utils/env";

export default function DashboardPage() {
  const { ready } = useAuth();
  const { countries, currencies, loading, error } = useCountryData();
  const { isMobile } = useScreenSize();
  const [panelOpen, setPanelOpen] = useState(false);

  // Full dashboard menu config
  const dashboardMenuConfig = DASHBOARD_MENU;

  // Determine current panel from URL
  const dashboardPath = isWindowDefined()
    ? window.location.pathname.replace(/^\/dashboard\//, "")
    : undefined;
  const currentPanel = dashboardMenuConfig.find(
    (item) => item.key === dashboardPath,
  );

  // Dashboard route state
  const {
    selectedPanel,
    menuSelectedPanel,
    selectedRegion: routeSelectedRegion,
    selectedSubregion: routeSelectedSubregion,
    selectedIsoCode,
    selectedCountry,
  } = useDashboardRouteState();

  // Region and subregion filter state
  const {
    selectedRegion,
    setSelectedRegion,
    selectedSubregion,
    setSelectedSubregion,
    search,
    setSearch,
    resetFilters,
  } = useRegionSubregionFilters();

  // Build dashboard meta (title and breadcrumbs)
  const { pageTitle, breadcrumbs } = getDashboardMeta({
    selectedPanel,
    selectedCountry,
    routeSelectedRegion,
    routeSelectedSubregion,
    currentPanel: currentPanel ? { title: currentPanel.label } : undefined,
    selectedRegion,
    selectedSubregion,
  });
  usePageTitle(pageTitle, {
    fallback: "Dashboard | Atlaset",
  });

  // Sync route state to filter state
  useEffect(() => {
    // Only update if different, and always preserve 'all' as a valid value
    if (routeSelectedRegion !== selectedRegion) {
      setSelectedRegion(routeSelectedRegion ?? "");
    }
    if (routeSelectedSubregion !== selectedSubregion) {
      setSelectedSubregion(routeSelectedSubregion ?? "");
    }
  }, [
    routeSelectedRegion,
    routeSelectedSubregion,
    selectedRegion,
    selectedSubregion,
    setSelectedRegion,
    setSelectedSubregion,
  ]);

  // Navigation handlers
  const {
    handlePanelChange,
    handleRegionSelect,
    handleSubregionSelect,
    handleCountrySelect,
    handleShowAllCountries,
    handleCrumbClick,
    handleBack,
  } = useDashboardNavigation(
    countries,
    selectedRegion ?? "all",
    selectedSubregion ?? "",
  );

  // Loading and error states
  if (loading || !ready)
    return <LoadingSpinner fullScreen message="Loading dashboard..." />;
  if (error) return <ErrorMessage fullScreen error={error} />;

  // Redirect early if at /dashboard
  if (location.pathname === "/dashboard") {
    return <Navigate to="/dashboard/overview" replace />;
  }

  return (
    <div className="min-h-screen relative">
      {/* Mobile: hamburger + drawer */}
      {isMobile && (
        <>
          <HamburgerButton onClick={() => setPanelOpen(true)} />
          <DashboardPanelMenu
            open={panelOpen}
            onClose={() => setPanelOpen(false)}
            selectedPanel={menuSelectedPanel}
            setSelectedPanel={handlePanelChange}
          />
        </>
      )}
      <div className="p-4 max-w-6xl mx-auto flex gap-6">
        {/* Desktop: panel */}
        {!isMobile && (
          <DashboardPanelMenu
            selectedPanel={menuSelectedPanel}
            setSelectedPanel={handlePanelChange}
          />
        )}
        <div className="flex-1 mt-12 min-w-0">
          <Breadcrumbs crumbs={breadcrumbs} onCrumbClick={handleCrumbClick} />
          <DashboardRoutes
            countries={countries}
            currencies={currencies}
            selectedRegion={selectedRegion || ""}
            setSelectedRegion={handleRegionSelect}
            selectedSubregion={selectedSubregion || ""}
            setSelectedSubregion={setSelectedSubregion}
            search={search}
            setSearch={setSearch}
            selectedIsoCode={selectedIsoCode || ""}
            setSelectedIsoCode={handleCountrySelect}
            onShowAllCountries={handleShowAllCountries}
            onSubregionChange={handleSubregionSelect}
            onResetFilters={resetFilters}
            onBack={handleBack}
          />
        </div>
      </div>
    </div>
  );
}
