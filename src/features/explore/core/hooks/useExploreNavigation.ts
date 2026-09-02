import { useLocation, useNavigate } from "react-router-dom";
import type { Country } from "@features/countries/types";
import type { CountryNavigationOrigin, CountryNavigationScope } from "../types";
import {
  getContextualRoute,
  getCountriesRoute,
} from "../utils/exploreNavigation";
import { EXPLORE_URLS } from "../../core/constants/exploreMenu";

interface CountryNavigationState {
  countryNavigationScope?: CountryNavigationScope;
  navigationCountryIsoCodes?: string[];
  countryNavigationOrigin?: CountryNavigationOrigin;
}

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
  const location = useLocation();

  const navigationState = location.state as CountryNavigationState | null;

  const countryNavigationScope: CountryNavigationScope =
    navigationState?.countryNavigationScope ??
    (selectedSubregion
      ? "subregion"
      : selectedRegion && selectedRegion !== "all"
        ? "region"
        : "all");

  const navigationCountryIsoCodes = navigationState?.navigationCountryIsoCodes;

  const countryNavigationOrigin = navigationState?.countryNavigationOrigin;

  const navigateToSection = (section: string) =>
    navigate(`/explore/${section}`);

  const navigateToRegion = (region: string) =>
    navigate(getCountriesRoute(region));

  const navigateToSubregion = (region: string, subregion: string) =>
    navigate(getCountriesRoute(region, subregion));

  const navigateToCountry = (
    isoCode: string | null,
    countryIsoCodes?: string[],
    origin?: CountryNavigationOrigin,
  ) => {
    if (!isoCode) {
      navigate(EXPLORE_URLS.countries);
      return;
    }

    const country = countries.find((c) => c.isoCode === isoCode);

    if (!country) return;

    navigate(
      getCountriesRoute(country.region, country.subregion, country.isoCode),
      {
        state: {
          countryNavigationScope,
          navigationCountryIsoCodes:
            countryIsoCodes ?? navigationCountryIsoCodes,
          countryNavigationOrigin:
            origin ?? navigationState?.countryNavigationOrigin,
        } satisfies CountryNavigationState,
      },
    );
  };

  const navigateToAllCountries = () => {
    navigate(EXPLORE_URLS.countries);
  };

  const navigateBack = (route?: string) => {
    if (typeof route === "string") {
      navigate(route);
      return;
    }

    const contextualRoute = countryNavigationOrigin
      ? getContextualRoute(countryNavigationOrigin.key)
      : undefined;

    if (contextualRoute) {
      navigate(contextualRoute);
      return;
    }

    if (countryNavigationScope === "subregion") {
      navigate(getCountriesRoute(selectedRegion, selectedSubregion));
      return;
    }

    if (countryNavigationScope === "region") {
      navigate(getCountriesRoute(selectedRegion));
      return;
    }

    navigate(EXPLORE_URLS.countries);
  };

  const crumbActions: Record<string, () => void> = {
    explore: () => navigate(EXPLORE_URLS.progress),
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

  const handleCrumbClick = (key: string) => {
    const contextualRoute = getContextualRoute(key);

    if (contextualRoute) {
      navigate(contextualRoute);
      return;
    }

    const action = crumbActions[key] ?? (() => navigateToSection(key));
    action();
  };

  return {
    countryNavigationScope,
    navigationCountryIsoCodes,
    countryNavigationOrigin,
    navigateToSection,
    navigateToRegion,
    navigateToSubregion,
    navigateToCountry,
    navigateToAllCountries,
    handleCrumbClick,
    navigateBack,
  };
}
