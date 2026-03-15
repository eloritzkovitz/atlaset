/**
 * Utility functions for filtering countries based on various criteria.
 */

import type { Layer } from "@features/atlas/layers";
import { filterBySearch } from "@utils/filter";
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

  // Apply filters
  return filterBySearch(countries, search, (c) =>
    [c.name, ...(c.aliases ?? [])].join(" "),
  ).filter((country) => {
    if (selectedRegion && country.region !== selectedRegion) return false;
    if (selectedSubregion && country.subregion !== selectedSubregion)
      return false;
    if (selectedSovereignty && country.sovereigntyType !== selectedSovereignty)
      return false;
    if (
      layerCountries &&
      layerCountries.length &&
      !layerCountries.includes(country.isoCode)
    )
      return false;
    return true;
  });
}

/**
 * Filters ISO codes based on layer selections.
 * @param countries
 * @param layers
 * @param layerSelections
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
  const visitedCount = filteredCountriesNoLayer.filter((c) =>
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

export interface CountryPropertyMap {
  [key: string]: keyof Country;
}

export const COUNTRY_PROPERTY_MAP: CountryPropertyMap = {
  isocode: "isoCode",
  region: "region",
  subregion: "subregion",
  capital: "capital",
  currency: "currency",
  language: "languages",
  sovereignty: "sovereigntyType",
};

/**
 * Filters countries by a property and value, supporting arrays and strings.
 * @param countries - Array of Country objects
 * @param property - Property name (e.g. "currency", "language")
 * @param value - Value to match (case-insensitive, partial match)
 */
export function filterCountriesByProperty(
  countries: Country[],
  property: string,
  value: string,
): Country[] {
  const key = COUNTRY_PROPERTY_MAP[property.toLowerCase()];
  if (!key) return [];
  const searchValue = value.toLowerCase();
  return countries.filter((country) => {
    const propValue = country[key];
    if (Array.isArray(propValue)) {
      // Handle array of strings (e.g., currencies, languages, aliases)
      return propValue.some(
        (v) => typeof v === "string" && v.toLowerCase().includes(searchValue),
      );
    }
    if (typeof propValue === "string") {
      return propValue.toLowerCase().includes(searchValue);
    }
    return false;
  });
}
