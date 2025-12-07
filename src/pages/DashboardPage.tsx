import { Navigate, Route, Routes } from "react-router-dom";
import {
  Breadcrumbs,
  type Crumb,
  ErrorMessage,
  LoadingSpinner,
} from "@components";
import { useCountryData } from "@contexts/CountryDataContext";
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

export default function DashboardPage() {
  const { countries, loading, error } = useCountryData();
  const {
    selectedPanel,
    menuSelectedPanel,
    selectedRegion,
    selectedSubregion,
    selectedIsoCode,
    selectedCountry,
  } = useDashboardRouteState();

  // Breadcrumbs
  const breadcrumbs: Crumb[] = getDashboardBreadcrumbs(
    selectedPanel,
    selectedRegion,
    selectedSubregion,
    selectedCountry
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
  } = useDashboardNavigation(countries, selectedRegion, selectedSubregion);

  // Loading and error states
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-4 max-w-6xl mx-auto flex gap-6">
        <DashboardPanelMenu
          selectedPanel={menuSelectedPanel}
          setSelectedPanel={handlePanelChange}
        />
        <div className="flex-1">
          <Breadcrumbs crumbs={breadcrumbs} onCrumbClick={handleCrumbClick} />
          <Routes>
            {/* Redirect /dashboard to /dashboard/countries/overview */}
            <Route path="" element={<Navigate to="countries/overview" replace />} />
            <Route path="countries" element={<Navigate to="/dashboard/countries/overview" replace />} />

            {/* Overview page */}
            <Route
              path="countries/overview"
              element={
                <CountryStats
                  selectedRegion={null}
                  setSelectedRegion={handleRegionSelect}
                  selectedSubregion={null}
                  setSelectedSubregion={handleSubregionSelect}
                  selectedIsoCode={null}
                  setSelectedIsoCode={handleCountrySelect}
                  onShowAllCountries={handleShowAllCountries}
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
                  selectedSubregion={null}
                  setSelectedSubregion={handleSubregionSelect}
                  selectedIsoCode={null}
                  setSelectedIsoCode={handleCountrySelect}
                  onShowAllCountries={handleShowAllCountries}
                />
              }
            />
            {/* Region, subregion, and country details */}
            <Route
              path="countries/:region/:subregion?/:isoCode?"
              element={
                <CountryStats
                  selectedRegion={selectedRegion}
                  setSelectedRegion={handleRegionSelect}
                  selectedSubregion={selectedSubregion}
                  setSelectedSubregion={handleSubregionSelect}
                  selectedIsoCode={selectedIsoCode}
                  setSelectedIsoCode={handleCountrySelect}
                  onShowAllCountries={handleShowAllCountries}
                  onBack={handleBack}
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
