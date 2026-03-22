/**
 * Utility functions for filtering countries based on various criteria.
 */

import type { Layer } from "@features/atlas/layers";
import { filterBySearch } from "@utils/filter";
import type { Country, CountryFilterOptions } from "../types";
import { TRANSCONTINENTAL_MAP } from "../constants/transcontinental";

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
  return filterBySearch(countries, search, (c) =>
    [c.name, ...(c.aliases ?? [])].join(" "),
  ).filter((country) => {
    const iso = country.isoCode?.toUpperCase?.();
    const extra =
      includeTranscontinental && iso
        ? TRANSCONTINENTAL_MAP.get(iso)
        : undefined;

    if (
      selectedRegion &&
      country.region !== selectedRegion &&
      extra?.additionalRegion !== selectedRegion
    )
      return false;

    if (
      selectedSubregion &&
      country.subregion !== selectedSubregion &&
      extra?.additionalSubregion !== selectedSubregion
    )
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

export interface CountryPropertyMap {
  [key: string]: keyof Country;
}

type PropertyConfig = { key: keyof Country; includeTC?: boolean };

const COUNTRY_PROPERTY_MAP: Record<string, PropertyConfig> = {
  isocode: { key: "isoCode" },
  region: { key: "region" },
  region_tc: { key: "region", includeTC: true },
  subregion: { key: "subregion" },
  subregion_tc: { key: "subregion", includeTC: true },
  capital: { key: "capital" },
  currency: { key: "currency" },
  language: { key: "languages" },
  sovereignty: { key: "sovereigntyType" },
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
  const propertyKey = property.toLowerCase();
  const config: PropertyConfig | undefined = COUNTRY_PROPERTY_MAP[propertyKey];

  // If the property is not recognized, return an empty array
  if (!config?.key) return [];

  // Determine if transcontinental overrides should be included
  const key = config.key;
  const includeTC = !!config.includeTC;

  const searchValue = value.toLowerCase();

  // Filter countries based on the specified property
  const getTokens = (country: Country) => {
    if (key === "region" || key === "subregion") {
      const tokens: string[] = [];
      const val = country[key];
      if (typeof val === "string" && val) tokens.push(val);
      if (includeTC) {
        const extra = TRANSCONTINENTAL_MAP.get(
          country.isoCode?.toUpperCase?.() ?? "",
        );
        const extraVal =
          key === "region"
            ? extra?.additionalRegion
            : extra?.additionalSubregion;
        if (typeof extraVal === "string") tokens.push(extraVal);
      }
      return tokens;
    }
    const prop = country[key];
    if (Array.isArray(prop)) return prop.filter(Boolean).map(String);
    if (typeof prop === "string") return [prop];
    return [];
  };

  return countries.filter((country) =>
    getTokens(country).some(
      (t) => typeof t === "string" && t.toLowerCase().includes(searchValue),
    ),
  );
}
