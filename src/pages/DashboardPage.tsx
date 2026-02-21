import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import {
  Breadcrumbs,
  ErrorMessage,
  LoadingSpinner,
  HamburgerButton,
} from "@components";
import { useCountryData, useRegionSubregionFilters } from "@features/countries";
import {
  AchievementsGrid,
  DashboardPanelMenu,
  CountryStats,
  useDashboardRouteState,
  useDashboardNavigation,
  getDashboardMeta,
  OverviewGrid,
  StatisticsGrid,
} from "@features/dashboard";
import { DASHBOARD_MENU } from "@features/dashboard/navigation/config/menu";
import { useAuth } from "@features/user";
import { usePageTitle, useScreenSize } from "@hooks";
import { isWindowDefined } from "@utils/env";

export default function DashboardPage() {
  const { ready } = useAuth();
  const { countries, loading, error } = useCountryData();
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

  // Render CountryStats with common props
  function renderCountryStats(propsOverride = {}) {
    return (
      <CountryStats
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
        resetFilters={resetFilters}
        onBack={undefined}
        {...propsOverride}
      />
    );
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
          <Routes>
            <Route path="overview" element={<OverviewGrid />} />
            <Route path="" element={<Navigate to="overview" replace />} />
            <Route
              path="countries"
              element={
                <Navigate to="/dashboard/countries/exploration" replace />
              }
            />
            {/* Exploration page */}
            <Route
              path="countries/exploration"
              element={renderCountryStats({
                selectedRegion: undefined,
                selectedSubregion: undefined,
                selectedIsoCode: undefined,
                onBack: undefined,
              })}
            />
            {/* All countries page */}
            <Route
              path="countries/all"
              element={renderCountryStats({
                selectedRegion: "all",
                selectedSubregion: "",
                selectedIsoCode: "",
                onBack: undefined,
              })}
            />
            {/* Region, subregion, and country details */}
            <Route
              path="countries/:region/:subregion?/:isoCode?"
              element={renderCountryStats({
                onBack: handleBack,
              })}
            />
            <Route path="achievements" element={<AchievementsGrid />} />
            <Route path="statistics/*" element={<StatisticsGrid />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
