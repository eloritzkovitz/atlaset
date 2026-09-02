import { filterCountries } from "@features/countries";
import type { Country } from "@features/countries/types";
import type { CountryNavigationScope } from "../../core/types";

interface GetCountryNavigationParams {
  countries: Country[];
  selectedIsoCode?: string;
  scope: CountryNavigationScope;
  region?: string;
  subregion?: string;
  navigationCountryIsoCodes?: string[];
  sovereignOnly?: boolean;
  search?: string;
}

/**
 * Returns the previous and next countries based on the current selection and navigation scope.
 * @param countries - List of countries to navigate through.
 * @param selectedIsoCode - The ISO code of the currently selected country.
 * @param scope - The navigation scope: "all", "region", or "subregion".
 * @param region - The currently selected region (if scope is "region" or "subregion").
 * @param subregion - The currently selected subregion (if scope is "subregion").
 * @param sovereignOnly - Whether to filter for sovereign countries only.
 * @param search - Optional search string to filter countries.
 * @returns An object with the previous and next countries, or undefined if not available.
 */
export function getCountryNavigation({
  countries,
  selectedIsoCode,
  scope,
  region,
  subregion,
  navigationCountryIsoCodes,
  sovereignOnly = false,
  search = "",
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
        selectedSovereignty: sovereignOnly ? "sovereign" : "",
      }).sort((a, b) => a.name.localeCompare(b.name));

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
