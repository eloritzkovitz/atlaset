import { filterCountries } from "@features/countries";
import type { Country } from "@features/countries/types";
import type { CountryNavigationScope } from "../../core/types";

interface GetCountryNavigationParams {
  countries: Country[];
  selectedIsoCode?: string;
  scope: CountryNavigationScope;
  region?: string;
  subregion?: string;
  search?: string;
  showSovereignOnly?: boolean;
  showVisitedOnly?: boolean;
  visitedCountryCodes?: string[];
  showTranscontinental?: boolean;
  navigationCountryIsoCodes?: string[];
}

/**
 * Returns the previous and next countries based on the current selection and navigation scope.
 * @param countries - List of countries to navigate through.
 * @param selectedIsoCode - The ISO code of the currently selected country.
 * @param scope - The navigation scope: "all", "region", or "subregion".
 * @param region - The currently selected region (if scope is "region" or "subregion").
 * @param subregion - The currently selected subregion (if scope is "subregion").
 * @param search - Optional search string to filter countries.
 * @param showSovereignOnly - Whether to filter for sovereign countries only.
 * @param showVisitedOnly - Whether to show only visited countries.
 * @param visitedCountryCodes - List of visited country ISO codes.
 * @param showTranscontinental - Whether to show transcontinental countries.
 * @param navigationCountryIsoCodes - Optional list of ISO codes to limit navigation to.
 * @returns An object with the previous and next countries, or undefined if not available.
 */
export function getCountryNavigation({
  countries,
  selectedIsoCode,
  scope,
  region,
  subregion,
  search = "",
  showSovereignOnly = false,
  showVisitedOnly,
  showTranscontinental,
  visitedCountryCodes,
  navigationCountryIsoCodes,
}: GetCountryNavigationParams) {
  const scopedCountries = navigationCountryIsoCodes
    ? countries.filter((country) =>
        navigationCountryIsoCodes.includes(country.isoCode),
      )
    : countries;

  const navigationCountries = navigationCountryIsoCodes
    ? scopedCountries.sort((a, b) => a.name.localeCompare(b.name))
    : filterCountries(scopedCountries, {
        search,
        selectedRegion:
          scope !== "all" && region && region !== "all" ? region : undefined,
        selectedSubregion:
          scope === "subregion" && subregion ? subregion : undefined,
        selectedSovereignty: showSovereignOnly ? "sovereign" : "",
        modifiers: showTranscontinental ? { tc: "include" } : undefined,
      })
        .filter(
          (country) =>
            !showVisitedOnly || visitedCountryCodes?.includes(country.isoCode),
        )
        .sort((a, b) => a.name.localeCompare(b.name));

  const index = navigationCountries.findIndex(
    (country) => country.isoCode === selectedIsoCode,
  );

  return {
    previous: index > 0 ? navigationCountries[index - 1] : undefined,
    next:
      index >= 0 && index < navigationCountries.length - 1
        ? navigationCountries[index + 1]
        : undefined,
  };
}
