import { useNavigate } from "react-router-dom";
import type { Country } from "@types";

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
  selectedSubregion: string
) {
  const navigate = useNavigate();

  // Navigation handlers
  const handlePanelChange = (panel: string) => navigate(`/dashboard/${panel}`);

  // Handle region and subregion selection
  const handleRegionSelect = (region: string) =>
    navigate(
      `/dashboard/countries/${encodeURIComponent(region.toLowerCase())}`
    );
  const handleSubregionSelect = (region: string, subregion: string) =>
    navigate(
      `/dashboard/countries/${encodeURIComponent(
        region.toLowerCase()
      )}/${encodeURIComponent(subregion.toLowerCase())}`
    );

  // Handle country selection
  const handleCountrySelect = (isoCode: string | null) => {
    if (!isoCode) {
      navigate(`/dashboard/countries`);
      return;
    }
    const country = countries?.find((c) => c.isoCode === isoCode);
    if (country && country.subregion) {
      navigate(
        `/dashboard/countries/${encodeURIComponent(
          country.region.toLowerCase()
        )}/${encodeURIComponent(country.subregion.toLowerCase())}/${
          country.isoCode
        }`
      );
    }
  };

  // Show all countries
  const handleShowAllCountries = () => navigate(`/dashboard/countries/all`);

  // Breadcrumb click handler
  const handleCrumbClick = (key: string) => {
    if (key === "dashboard") {
      navigate(`/dashboard/countries/overview`);
    } else if (key === "countries") {
      navigate(`/dashboard/countries/all`);
    } else if (key === "region") {
      navigate(
        `/dashboard/countries/${encodeURIComponent(
          selectedRegion?.toLowerCase() ?? ""
        )}`
      );
    } else if (key === "subregion") {
      navigate(
        `/dashboard/countries/${encodeURIComponent(
          selectedRegion?.toLowerCase() ?? ""
        )}/${encodeURIComponent(selectedSubregion?.toLowerCase() ?? "")}`
      );
    } else if (key === "country") {
      // No-op
    } else {
      handlePanelChange(key);
    }
  };

  return {
    handlePanelChange,
    handleRegionSelect,
    handleSubregionSelect,
    handleCountrySelect,
    handleShowAllCountries,
    handleCrumbClick,
  };
}
