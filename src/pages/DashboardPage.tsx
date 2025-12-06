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
import { PANEL_BREADCRUMBS } from "@features/dashboard/menu/menu";

export default function DashboardPage() {
  const { loading, error } = useCountryData();

  const {
    selectedPanel,
    setSelectedPanel,
    selectedRegion,
    setSelectedRegion,
    selectedSubregion,
    setSelectedSubregion,
    selectedIsoCode,
    setSelectedIsoCode,
    selectedCountry,
    handleShowAllCountries,
    handleCrumbClick,
  } = useDashboardNavigation();

  // Construct breadcrumbs dynamically
  const breadcrumbs: Crumb[] = [
    ...(PANEL_BREADCRUMBS[selectedPanel] || []),
    selectedRegion && { label: selectedRegion, key: "region" },
    selectedSubregion && { label: selectedSubregion, key: "subregion" },
    selectedCountry && { label: selectedCountry.name, key: "country" },
  ].filter(Boolean) as Crumb[];

  // Handle loading and error states
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-4 max-w-6xl mx-auto flex gap-6">
        <DashboardPanelMenu
          selectedPanel={selectedPanel}
          setSelectedPanel={setSelectedPanel}
        />
        <div className="flex-1">
          <Breadcrumbs crumbs={breadcrumbs} onCrumbClick={handleCrumbClick} />
          {selectedPanel === "countries" && (
            <CountryStats
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              selectedSubregion={selectedSubregion}
              setSelectedSubregion={setSelectedSubregion}
              selectedIsoCode={selectedIsoCode}
              setSelectedIsoCode={setSelectedIsoCode}
              onShowAllCountries={handleShowAllCountries}
            />
          )}
          {selectedPanel === "trips-overview" && <TripsStats />}
          {selectedPanel === "trips-history" && <TripHistory />}
          {selectedPanel === "trips-month" && <TripsByMonth />}
          {selectedPanel === "trips-year" && <TripsByYear />}
        </div>
      </div>
    </div>
  );
}
