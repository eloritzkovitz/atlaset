import { useNavigate } from "react-router-dom";
import type { Country } from "@features/countries";
import { DASHBOARD_URLS } from "../constants/dashboardMenu";
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

  const handlePanelChange = (panel: string) => navigate(`/dashboard/${panel}`);
  const handleRegionSelect = (region: string) =>
    navigate(getCountryRoute(region));
  const handleSubregionSelect = (region: string, subregion: string) =>
    navigate(getCountryRoute(region, subregion));

  // Handle country selection by navigating to the corresponding country route or defaulting to the countries panel
  const handleCountrySelect = (isoCode: string | null) => {
    if (!isoCode) return navigate(DASHBOARD_URLS.countries);

    const country = countries?.find((c) => c.isoCode === isoCode);
    if (country) {
      navigate(
        getCountryRoute(country.region, country.subregion, country.isoCode),
      );
    }
  };

  const handleShowAllCountries = () => navigate(DASHBOARD_URLS.countries);
  const handleBack = () => navigate(-1);

  // Breadcrumb actions mapping powered directly by menu constants
  const crumbActions: Record<string, () => void> = {
    dashboard: () => navigate(DASHBOARD_URLS.overview),
    countries: () => navigate(DASHBOARD_URLS.countries),
    currencies: () => navigate(DASHBOARD_URLS.currencies),
    region: () => navigate(getCountryRoute(selectedRegion)),
    subregion: () =>
      navigate(getCountryRoute(selectedRegion, selectedSubregion)),
    country: () => {},
    "currencies/exchange": () => navigate("/dashboard/currencies/exchange"),
  };

  // Handle breadcrumb click by executing the corresponding action or defaulting to panel change
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
