import { useNavigate } from "react-router-dom";
import type { Country } from "@features/countries/types";
import { getCountriesRoute } from "../utils/exploreNavigation";
import { EXPLORE_URLS } from "../../core/constants/exploreMenu";

/**
 * Manages explore navigation state and handlers.
 * @param countries - List of countries.
 * @param selectedRegion - Optional currently selected region.
 * @param selectedSubregion - Optional currently selected subregion.
 * @returns Navigation state and handlers.
 */
export function useExploreNavigation(
  countries: Country[],
  selectedRegion?: string,
  selectedSubregion?: string,
) {
  const navigate = useNavigate();

  const navigateToPanel = (panel: string) => navigate(`/explore/${panel}`);

  const navigateToRegion = (region: string) =>
    navigate(getCountriesRoute(region));

  const navigateToSubregion = (region: string, subregion: string) =>
    navigate(getCountriesRoute(region, subregion));

  const navigateToCountry = (isoCode: string | null) => {
    if (!isoCode) return navigate(EXPLORE_URLS.countries);

    const country = countries.find((c) => c.isoCode === isoCode);
    if (country) {
      navigate(
        getCountriesRoute(country.region, country.subregion, country.isoCode),
      );
    }
  };

  const navigateToAllCountries = () => {
    navigate(EXPLORE_URLS.countries);
  };

  const navigateBack = () => navigate(-1);

  const crumbActions: Record<string, () => void> = {
    explore: () => navigate(EXPLORE_URLS.overview),
    countries: () => navigate(EXPLORE_URLS.countries),
    region: () => navigate(getCountriesRoute(selectedRegion)),
    subregion: () =>
      navigate(getCountriesRoute(selectedRegion, selectedSubregion)),
    country: () => {},
    languages: () => navigate(EXPLORE_URLS.languages),
    currencies: () => navigate(EXPLORE_URLS.currencies),
    "currencies/exchange": () => navigate("/explore/currencies/exchange"),
    timezones: () => navigate(EXPLORE_URLS.timezones),
    achievements: () => navigate(EXPLORE_URLS.achievements),
  };

  // Handle crumb click by executing the corresponding action or navigating to the panel
  const handleCrumbClick = (key: string) => {
    const action = crumbActions[key] ?? (() => navigateToPanel(key));
    action();
  };

  return {
    navigateToPanel,
    navigateToRegion,
    navigateToSubregion,
    navigateToCountry,
    navigateToAllCountries,
    handleCrumbClick,
    navigateBack,
  };
}
