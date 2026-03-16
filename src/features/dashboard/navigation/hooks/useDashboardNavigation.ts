import { useNavigate } from "react-router-dom";
import type { Country } from "@features/countries";

/**
 * Manages dashboard navigation state and handlers.
 * @param countries - List of all countries
 * @param selectedRegion - Currently selected region
 * @param selectedSubregion - Currently selected subregion *
 * @returns Navigation state and handlers
 */
export function useDashboardNavigation(
  countries: Country[],
  selectedRegion: string,
  selectedSubregion: string,
) {
  const navigate = useNavigate();

  // Build route for country details based on region, subregion, and isoCode
  const buildCountryRoute = (
    region?: string,
    subregion?: string,
    isoCode?: string,
  ) => {
    const r = region ? encodeURIComponent(region.toLowerCase()) : "all";
    const s = subregion ? encodeURIComponent(subregion.toLowerCase()) : "all";
    return isoCode
      ? `/dashboard/countries/${r}/${s}/${isoCode}`
      : subregion
        ? `/dashboard/countries/${r}/${s}`
        : region
          ? `/dashboard/countries/${r}`
          : `/dashboard/countries/all`;
  };

  // Navigation handlers
  const handlePanelChange = (panel: string) => navigate(`/dashboard/${panel}`);

  // Region and subregion select handlers
  const handleRegionSelect = (region: string) =>
    navigate(buildCountryRoute(region));
  const handleSubregionSelect = (region: string, subregion: string) =>
    navigate(buildCountryRoute(region, subregion));

  // Country select handler
  const handleCountrySelect = (isoCode: string | null) => {
    if (!isoCode) {
      navigate(`/dashboard/countries`);
      return;
    }
    const country = countries?.find((c) => c.isoCode === isoCode);
    if (country) {
      navigate(
        buildCountryRoute(country.region, country.subregion, country.isoCode),
      );
    }
  };

  // Show all countries handler
  const handleShowAllCountries = () => navigate(`/dashboard/countries/all`);

  // Breadcrumb mapping
  const crumbRoutes: Record<string, () => void> = {
    dashboard: () => navigate(`/dashboard/overview`),
    countries: () => navigate(`/dashboard/countries/all`),
    region: () => navigate(buildCountryRoute(selectedRegion)),
    subregion: () =>
      navigate(buildCountryRoute(selectedRegion, selectedSubregion)),
    "currencies/exchange": () => navigate(`/dashboard/currencies/exchange`),
  };

  // Crumb click handler
  const handleCrumbClick = (key: string) => {
    if (crumbRoutes[key]) {
      crumbRoutes[key]();
    } else if (key === "country") {
      // No-op
    } else {
      handlePanelChange(key);
    }
  };

  // Back handler
  const handleBack = () => navigate(-1);

  return {
    handlePanelChange,
    handleRegionSelect,
    handleSubregionSelect,
    handleCountrySelect,
    handleShowAllCountries,
    handleCrumbClick,
    handleBack,
  };
}
