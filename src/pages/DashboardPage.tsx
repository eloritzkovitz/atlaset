import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import {
  Breadcrumbs,
  type Crumb,
  ErrorMessage,
  LoadingSpinner,
  HamburgerButton,
} from "@components";
import { useAuth } from "@contexts/AuthContext";
import { useCountryData } from "@contexts/CountryDataContext";
import { useRegionSubregionFilters } from "@features/countries";
import {
  DashboardPanelMenu,
  CountryStats,
  TripHistory,
  TripsByMonth,
  TripsByYear,
  TripsStats,
  useDashboardNavigation,
} from "@features/dashboard";
import { useDashboardRouteState } from "@features/dashboard/countries/hooks/useDashboardRouteState";
import { getDashboardBreadcrumbs } from "@features/dashboard/navigation/config/breadcrumbs";
import { useIsMobile } from "@hooks/useIsMobile";

export default function DashboardPage() {
  const { user, ready } = useAuth();
  const { countries, loading, error } = useCountryData();
  const isMobile = useIsMobile();
  const [panelOpen, setPanelOpen] = useState(false);

  // Use global region/subregion/search filter state
  const {
    selectedRegion,
    setSelectedRegion,
    selectedSubregion,
    setSelectedSubregion,
    search,
    setSearch,
    resetFilters,
  } = useRegionSubregionFilters();

  // Dashboard route state
  const {
    selectedPanel,
    menuSelectedPanel,
    selectedRegion: routeSelectedRegion,
    selectedSubregion: routeSelectedSubregion,
    selectedIsoCode,
    selectedCountry,
  } = useDashboardRouteState();

  // Sync route state to filter state
  useEffect(() => {
    if (routeSelectedRegion !== selectedRegion)
      setSelectedRegion(routeSelectedRegion || "");
    if (routeSelectedSubregion !== selectedSubregion)
      setSelectedSubregion(routeSelectedSubregion || "");
  }, [
    routeSelectedRegion,
    routeSelectedSubregion,
    setSelectedRegion,
    setSelectedSubregion,
  ]);

  // Breadcrumbs
  const breadcrumbs: Crumb[] = getDashboardBreadcrumbs(
    selectedPanel,
    selectedRegion,
    selectedSubregion,
    selectedCountry ?? null
  );

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
    selectedSubregion ?? ""
  );

  // Loading and error states
  if (loading || !ready) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect early if at /dashboard
  if (location.pathname === "/dashboard") {
    return <Navigate to="/dashboard/countries/overview" replace />;
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
            {/* Redirect /dashboard to /dashboard/countries/overview */}
            <Route
              path=""
              element={<Navigate to="countries/overview" replace />}
            />
            <Route
              path="countries"
              element={<Navigate to="/dashboard/countries/overview" replace />}
            />

            {/* Overview page */}
            <Route
              path="countries/overview"
              element={
                <CountryStats
                  selectedRegion={undefined}
                  setSelectedRegion={handleRegionSelect}
                  selectedSubregion={undefined}
                  setSelectedSubregion={setSelectedSubregion}
                  search={search}
                  setSearch={setSearch}
                  selectedIsoCode={undefined}
                  setSelectedIsoCode={handleCountrySelect}
                  onShowAllCountries={handleShowAllCountries}
                  onSubregionChange={handleSubregionSelect}
                  resetFilters={resetFilters}
                />
              }
            />
            {/* All countries page */}
            <Route
              path="countries/all"
              element={
                <CountryStats
                  selectedRegion="all"
                  setSelectedRegion={handleRegionSelect}
                  selectedSubregion={""}
                  setSelectedSubregion={setSelectedSubregion}
                  search={search}
                  setSearch={setSearch}
                  selectedIsoCode={""}
                  setSelectedIsoCode={handleCountrySelect}
                  onShowAllCountries={handleShowAllCountries}
                  onSubregionChange={handleSubregionSelect}
                  resetFilters={resetFilters}
                />
              }
            />
            {/* Region, subregion, and country details */}
            <Route
              path="countries/:region/:subregion?/:isoCode?"
              element={
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
                  onBack={handleBack}
                  onSubregionChange={handleSubregionSelect}
                  resetFilters={resetFilters}
                />
              }
            />
            {/* Other dashboard panels */}
            <Route path="trips/overview" element={<TripsStats />} />
            <Route path="trips/history" element={<TripHistory />} />
            <Route path="trips/month" element={<TripsByMonth />} />
            <Route path="trips/year" element={<TripsByYear />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
