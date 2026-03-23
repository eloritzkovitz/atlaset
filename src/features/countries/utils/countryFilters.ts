/**
 * Utility functions for filtering countries based on various criteria.
 */

import type { Layer } from "@features/atlas/layers";
import { filterBySearch } from "@utils/filter";
import {
  buildSearchString,
  getPropertyTokens,
  resolvePropertyConfig,
  parsePropertySearch,
} from "./countrySearch";
import type { Country, CountryFilterOptions } from "../types";

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
) {
  const {
    search = "",
    selectedRegion,
    selectedSubregion,
    selectedSovereignty,
    layerCountries,
  } = options;

  // Determine if transcontinental overrides should be included
  const includeTranscontinental = options.includeTranscontinental === true;

  // Apply filters
  return filterBySearch(countries, search, (c) => buildSearchString(c)).filter(
    (country) => {
      if (
        selectedRegion &&
        country.region !== selectedRegion &&
        !(
          getPropertyTokens(country, "region", includeTranscontinental) || []
        ).includes(selectedRegion)
      )
        return false;

      if (
        selectedSubregion &&
        country.subregion !== selectedSubregion &&
        !(
          getPropertyTokens(country, "subregion", includeTranscontinental) || []
        ).includes(selectedSubregion)
      )
        return false;

      if (
        selectedSovereignty &&
        country.sovereigntyType !== selectedSovereignty
      )
        return false;

      if (
        layerCountries &&
        layerCountries.length &&
        !layerCountries.includes(country.isoCode)
      )
        return false;

      return true;
    },
  );
}

/**
 * Filters countries by a property and value, supporting arrays and strings.
 * @param countries - Array of Country objects.
 * @param property - Property name.
 * @param value - Value to match (case-insensitive, partial match).
 */
export function filterCountriesByProperty(
  countries: Country[],
  property: string,
  value: string,
  visitedIsoCodes?: string[],
  visitedMap?: Record<string, number>,
): Country[] {
  const config = resolvePropertyConfig(property);
  if (!config?.key) return [];

  const key = config.key;
  const includeTC = !!config.includeTC;
  const searchValue = value.toLowerCase();

  // special-case numeric visit count comparisons
  if (key === "visits") {
    const m = value.trim().match(/^(>=|<=|>|<|=)?\s*(\d+)$/);
    if (!m) return [];
    const op = m[1] || "=";
    const num = Number(m[2]);
    const vmap = visitedMap ?? {};
    return countries.filter((country) => {
      const isVisited = (visitedIsoCodes ?? []).includes(country.isoCode);
      const queryIsZero =
        (op === "=" && num === 0) || (op === "<" && num === 1);
      if (!queryIsZero && num > 0 && !isVisited) return false;
      const count = vmap[country.isoCode] || 0;
      switch (op) {
        case ">":
          return count > num;
        case "<":
          return count < num;
        case ">=":
          return count >= num;
        case "<=":
          return count <= num;
        case "=":
        default:
          return count === num;
      }
    });
  }

  return countries.filter((country) =>
    getPropertyTokens(
      country,
      key,
      includeTC,
      visitedIsoCodes,
      visitedMap,
    ).some(
      (t: string) =>
        typeof t === "string" && t.toLowerCase().includes(searchValue),
    ),
  );
}

/**
 * Filters ISO codes based on layer selections.
 * @param countries - List of all countries.
 * @param layers - List of all layers.
 * @param layerSelections - Current layer selections.
 * @returns Filtered list of ISO codes.
 */
export function getFilteredIsoCodes(
  countries: Country[],
  layers: Layer[],
  layerSelections: Record<string, string>,
) {
  const base = countries.map((c) => c.isoCode);

  return layers.reduce((accIsoCodes, layer) => {
    const selection = layerSelections[layer.id] || "all";
    if (selection === "only") {
      return accIsoCodes.filter((iso) => layer.countries.includes(iso));
    }
    if (selection === "exclude") {
      return accIsoCodes.filter((iso) => !layer.countries.includes(iso));
    }
    return accIsoCodes; // "all"
  }, base as string[]);
}

/**
 * Calculates country counts based on filtered countries and visited ISO codes.
 * @param filteredCountries - Countries after applying all filters including layers.
 * @param filteredCountriesNoLayer - Countries after applying all filters except layers.
 * @param visitedIsoCodes - List of visited country ISO codes.
 * @returns An object containing counts of various country categories.
 */
export function getCountryCounts({
  filteredCountries,
  filteredCountriesNoLayer,
  visitedIsoCodes,
}: {
  filteredCountries: Country[];
  filteredCountriesNoLayer: Country[];
  visitedIsoCodes: string[];
}) {
  const allCount = filteredCountries.length;
  const allCountWithoutLayers = filteredCountriesNoLayer.length;
  const sovereignCount = filteredCountries.filter(
    (c) => c.sovereigntyType === "Sovereign",
  ).length;
  const visitedCount = filteredCountries.filter((c) =>
    visitedIsoCodes.includes(c.isoCode),
  ).length;
  return {
    allCount,
    allCountWithoutLayers,
    sovereignCount,
    visitedCount,
  };
}

/**
 * Returns a filter function for sovereignty based on the criteria.
 * @param sovereignOnly - If true, only matches countries with sovereigntyType "Sovereign".
 */
export function createSovereigntyFilter(sovereignOnly?: boolean) {
  return (c: Country) =>
    sovereignOnly ? c.sovereigntyType === "Sovereign" : true;
}

/**
 * Apply property-based search or normal search with layer filtering.
 */
export function applyPropertySearch(
  countries: Country[],
  search: string,
  visitedIsoCodes: string[] | undefined,
  filterParams: CountryFilterOptions,
  filteredIsoCodes: string[] | undefined,
  visitedMap?: Record<string, number>,
) {
  const parsed = parsePropertySearch(search);
  if (parsed) {
    return filterCountriesByProperty(
      countries,
      parsed.property,
      parsed.query,
      visitedIsoCodes,
      visitedMap,
    );
  }
  return filterCountries(countries, {
    ...filterParams,
    layerCountries: filteredIsoCodes,
  });
}
