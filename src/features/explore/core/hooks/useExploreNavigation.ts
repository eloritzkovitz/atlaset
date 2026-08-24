import { useNavigate } from "react-router-dom";
import type { Country } from "@features/countries/types";
import { getCountryRoute } from "../utils/exploreNavigation";
import { EXPLORE_URLS } from "../../core/constants/exploreMenu";

/**
 * Manages explore navigation state and handlers.
 * @param countries - List of countries.
 * @param selectedRegion - Currently selected region.
 * @param selectedSubregion - Currently selected subregion.
 * @returns Navigation state and handlers.
 */
export function useExploreNavigation(
  countries: Country[],
  selectedRegion: string,
  selectedSubregion: string,
) {
  const navigate = useNavigate();

  const navigateToPanel = (panel: string) => navigate(`/explore/${panel}`);
  const handleRegionSelect = (region: string) =>
    navigate(getCountryRoute(region));
  const handleSubregionSelect = (region: string, subregion: string) =>
    navigate(getCountryRoute(region, subregion));

  // Handle country selection by navigating to the corresponding country route or defaulting to the countries panel
  const handleCountrySelect = (isoCode: string | null) => {
    if (!isoCode) return navigate(EXPLORE_URLS.countries);

    const country = countries?.find((c) => c.isoCode === isoCode);
    if (country) {
      navigate(
        getCountryRoute(country.region, country.subregion, country.isoCode),
      );
    }
  };

  const handleShowAllCountries = () => navigate(EXPLORE_URLS.countries);
  const handleBack = () => navigate(-1);

  const crumbActions: Record<string, () => void> = {
    countries: () => navigate(EXPLORE_URLS.countries),
    currencies: () => navigate(EXPLORE_URLS.currencies),
    region: () => navigate(getCountryRoute(selectedRegion)),
    subregion: () =>
      navigate(getCountryRoute(selectedRegion, selectedSubregion)),
    country: () => {},
    "currencies/exchange": () => navigate("/explore/currencies/exchange"),
  };

  // Handle breadcrumb click by executing the corresponding action or defaulting to panel change
  const handleCrumbClick = (key: string) => {
    const action = crumbActions[key] ?? (() => navigateToPanel(key));
    action();
  };

  return {
    navigateToPanel,
    handleRegionSelect,
    handleSubregionSelect,
    handleCountrySelect,
    handleShowAllCountries,
    handleCrumbClick,
    handleBack,
  };
}
