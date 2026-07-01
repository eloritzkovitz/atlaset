import { useNavigate } from "react-router-dom";
import type { Country } from "@features/countries";
import { getCountryRoute } from "../utils/dashboardNavigation";

/**
 * Manages dashboard navigation state and handlers.
 * @param countries - List of countries.
 * @param selectedRegion - Currently selected region.
 * @param selectedSubregion - Currently selected subregion.
 * @returns Navigation state and handlers.
 */
export function useDashboardNavigation(
  countries: Country[],
  selectedRegion: string,
  selectedSubregion: string,
) {
  const navigate = useNavigate();

  // Navigation handlers
  const handlePanelChange = (panel: string) => navigate(`/dashboard/${panel}`);
  const handleRegionSelect = (region: string) =>
    navigate(getCountryRoute(region));
  const handleSubregionSelect = (region: string, subregion: string) =>
    navigate(getCountryRoute(region, subregion));
  const handleCountrySelect = (isoCode: string | null) => {
    if (!isoCode) return navigate(`/dashboard/countries`);

    const country = countries?.find((c) => c.isoCode === isoCode);

    if (country)
      navigate(
        getCountryRoute(country.region, country.subregion, country.isoCode),
      );
  };
  const handleShowAllCountries = () => navigate(`/dashboard/countries/all`);
  const handleBack = () => navigate(-1);

  // Breadcrumb actions mapping
  const crumbActions: Record<string, () => void> = {
    dashboard: () => navigate(`/dashboard/overview`),
    countries: () => navigate(`/dashboard/countries/all`),
    region: () => navigate(getCountryRoute(selectedRegion)),
    subregion: () =>
      navigate(getCountryRoute(selectedRegion, selectedSubregion)),
    country: () => {},
    "currencies/exchange": () => navigate(`/dashboard/currencies/exchange`),
  };

  // Crumb click handler
  const handleCrumbClick = (key: string) => {
    const action = crumbActions[key] ?? (() => handlePanelChange(key));
    action();
  };

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
