import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Breadcrumbs, ErrorMessage, LoadingSpinner } from "@components";
import { useCountryData, useRegionSubregionFilters } from "@features/countries";
import {
  AchievementsGrid,
  DashboardPanelMenu,
  CountryStats,
  TripHistory,
  TripsByMonth,
  TripsByYear,
  TripsStats,
  useDashboardRouteState,
  useDashboardNavigation,
  getDashboardMeta,
} from "@features/dashboard";
import {
  COUNTRIES_SUBMENU,
  ACHIEVEMENTS_MENU,
  TRIPS_SUBMENU,
} from "@features/dashboard/navigation/config/menu";
import { useAuth } from "@features/user";
import { usePageTitle } from "@hooks";
import { SidebarLayout } from "@layout";

export default function DashboardPage() {
  const { user, ready } = useAuth();
  const { countries, loading, error } = useCountryData();

  // Full dashboard menu config
  const dashboardMenuConfig = [
    ...COUNTRIES_SUBMENU,
    ...ACHIEVEMENTS_MENU,
    ...TRIPS_SUBMENU,
  ];

  // Determine current panel from URL
  const dashboardPath =
    typeof window !== "undefined"
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
    currentPanel,
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

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect early if at /dashboard
  if (location.pathname === "/dashboard") {
    return <Navigate to="/dashboard/countries/exploration" replace />;
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
    <SidebarLayout
      menu={
        <DashboardPanelMenu
          selectedPanel={menuSelectedPanel}
          setSelectedPanel={handlePanelChange}
        />
      }
      contentClassName="flex-1 mt-12 min-w-0"
    >
      <Breadcrumbs crumbs={breadcrumbs} onCrumbClick={handleCrumbClick} />
      <Routes>
        {/* Redirect /dashboard to /dashboard/countries/exploration */}
        <Route
          path=""
          element={<Navigate to="countries/exploration" replace />}
        />
        <Route
          path="countries"
          element={<Navigate to="/dashboard/countries/exploration" replace />}
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
        {/* Achievements page */}
        <Route path="achievements" element={<AchievementsGrid />} />
        {/* Other dashboard panels */}
        <Route path="trips/overview" element={<TripsStats />} />
        <Route path="trips/history" element={<TripHistory />} />
        <Route path="trips/month" element={<TripsByMonth />} />
        <Route path="trips/year" element={<TripsByYear />} />
      </Routes>
    </SidebarLayout>
  );
}
