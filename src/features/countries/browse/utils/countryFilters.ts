/**
 * Utility functions for filtering countries based on various criteria.
 */

import type { VisitContext } from "@features/visits/types";
import { filterBySearch } from "@utils";
import { applyVisitModifiersToCountry } from "./countryModifiers";
import { getQualifierTokens } from "./countryQualifiers";
import { buildSearchString } from "./countrySearch";
import type { CountryFilterOptions } from "../types";
import type { Country } from "../../types";

/**
 * Filters countries based on various criteria.
 * @param countries - The list of countries to filter.
 * @param options - Filtering options for countries.
 * @returns Filtered list of countries.
 * @see CountryFilterOptions
 */
export function filterCountries(
  countries: Country[],
  options: CountryFilterOptions,
  visitContext?: VisitContext,
): Country[] {
  const {
    search = "",
    selectedRegion,
    selectedSubregion,
    selectedGeoType,
    selectedSovereignty,
    layerCountries,
  } = options;

  const mods = options.modifiers ?? {};

  return filterBySearch(countries, search, (country) =>
    buildSearchString(country),
  ).filter((country) => {
    if (
      selectedRegion &&
      (country as unknown as Record<string, unknown>).regionKey !==
        selectedRegion &&
      !getQualifierTokens(country, "region").includes(selectedRegion)
    ) {
      return false;
    }

    if (
      selectedSubregion &&
      (country as unknown as Record<string, unknown>).subregionKey !==
        selectedSubregion &&
      !getQualifierTokens(country, "subregion").includes(selectedSubregion)
    ) {
      return false;
    }

    if (
      selectedSovereignty &&
      country.sovereigntyStatus !== selectedSovereignty
    ) {
      return false;
    }

    if (selectedGeoType && country.geoType !== selectedGeoType) {
      return false;
    }

    if (
      layerCountries &&
      layerCountries.length > 0 &&
      !layerCountries.includes(country.isoCode)
    ) {
      return false;
    }

    return applyVisitModifiersToCountry(country, mods, visitContext);
  });
}

/**
 * Calculates country counts based on filtered countries and visited ISO codes.
 * @param filteredCountries - Countries after applying all filters including layers.
 * @param visitedIsoCodes - List of visited country ISO codes.
 * @param wantToVisitIsoCodes - List of want-to-visit country ISO codes.
 * @returns An object containing counts of various country categories.
 */
export function getCountryCounts({
  filteredCountries,
  visitedIsoCodes,
  wantToVisitIsoCodes,
}: {
  filteredCountries: Country[];
  visitedIsoCodes: string[];
  wantToVisitIsoCodes: string[];
}) {
  const allCount = filteredCountries.length;

  const sovereignCount = filteredCountries.filter(
    (country) => country.sovereigntyStatus === "sovereign",
  ).length;

  const visitedCount = filteredCountries.filter((country) =>
    visitedIsoCodes.includes(country.isoCode),
  ).length;

  const wantToVisitCount = filteredCountries.filter((country) =>
    wantToVisitIsoCodes.includes(country.isoCode),
  ).length;

  return {
    allCount,
    sovereignCount,
    visitedCount,
    wantToVisitCount,
  };
}

/**
 * Returns a filter function for sovereignty based on the criteria.
 * @param sovereignOnly - If true, only matches countries with sovereigntyStatus "Sovereign".
 */
export function createSovereigntyFilter(sovereignOnly?: boolean) {
  return (country: Country) =>
    sovereignOnly ? country.sovereigntyStatus === "sovereign" : true;
}
