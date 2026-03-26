/**
 * Utility functions for searching and filtering countries based on their properties.
 */

import type { VisitContext } from "@features/visits";
import {
  COUNTRY_PROPERTY_MAP,
  type CountryPropertyKey,
  type CountryPropertyConfig,
} from "../constants/propertyConfig";
import { TRANSCONTINENTAL_MAP } from "../constants/transcontinental";
import type { Country } from "../types";

/**
 * Resolves a property configuration based on a given property name.
 * This is used to determine how to filter countries based on user input in the format "property:query".
 * @param property - The property name to resolve.
 * @returns The property configuration or undefined if not found.
 */
export function resolvePropertyConfig(
  property: string,
): CountryPropertyConfig | undefined {
  return COUNTRY_PROPERTY_MAP[property.toLowerCase()];
}

/**
 * Returns a list of supported property names for searching.
 * @returns An array of supported property names.
 */
export function getSupportedProperties() {
  return Object.keys(COUNTRY_PROPERTY_MAP);
}

/**
 * Parses a search string for property-based searching.
 * @param input - The search string input by the user.
 * @returns An object containing the property and query if the input matches the expected format, otherwise null.
 */
export function parsePropertySearch(input: string) {
  const m = input.trim().match(/^([a-zA-Z_]+):\s*(.+)$/i);
  if (!m) return null;
  return { property: m[1].toLowerCase(), query: m[2] };
}

/**
 * Builds a search string for a country by concatenating relevant properties.
 * @param country - The country object to build the search string from.
 * @returns A string that combines the country's name, iso code, region, subregion, and aliases for search purposes.
 */
export function buildSearchString(country: Country) {
  return [
    country.name,
    country.isoCode,
    country.region ?? "",
    country.subregion ?? "",
    ...(country.aliases ?? []),
  ].join(" ");
}

/**
 * Return searchable tokens for a specific country property. Includes transcontinental countries when requested.
 * @param country - The country to extract tokens from.
 * @param key - The property key to extract.
 * @param options - Additional options for token extraction.
 * @returns An array of strings representing the tokens for the specified property of the country.
 * @see CountryPropertyKey for supported keys and special handling.
 */
export function getPropertyTokens(
  country: Country,
  key: CountryPropertyKey,
  options?: { includeTC?: boolean; visitContext?: VisitContext },
) {
  const { includeTC = false, visitContext } = options ?? {};
  const vIso = visitContext?.visitedIsoCodes;
  const vMap = visitContext?.visitedMap;
  const vYearMap = visitContext?.visitedYearMap;

  // Convert a set of years to an array of strings, or return an empty array if undefined
  const yearSetToStrings = (set?: Set<number>) =>
    set ? Array.from(set).map(String) : [];

  // Get the earliest year from a set of years, or null if the set is empty or undefined
  const firstYearFromSet = (set?: Set<number>) =>
    set && set.size > 0 ? String(Math.min(...Array.from(set))) : null;

  // Get the latest year from a set of years, or null if the set is empty or undefined
  const lastYearFromSet = (set?: Set<number>) =>
    set && set.size > 0 ? String(Math.max(...Array.from(set))) : null;

  // Handle special cases for region/subregion with transcontinental inclusion, sovereign status, and visit-related properties
  if (key === "region" || key === "subregion") {
    const tokens: string[] = [];
    const val = country[key];
    if (val) tokens.push(val);
    if (includeTC) {
      const extra = TRANSCONTINENTAL_MAP.get(
        country.isoCode?.toUpperCase?.() ?? "",
      );
      const extraVal =
        key === "region" ? extra?.additionalRegion : extra?.additionalSubregion;
      if (extraVal) tokens.push(extraVal);
    }
    return tokens;
  }
  if (key === "sovereign") {
    return [country.sovereigntyType === "Sovereign" ? "true" : "false"];
  }
  if (key === "visited")
    return vIso ? [vIso.includes(country.isoCode) ? "true" : "false"] : [];
  if (key === "visits") return vMap ? [String(vMap[country.isoCode] || 0)] : [];
  if (key === "visitYear") return yearSetToStrings(vYearMap?.[country.isoCode]);
  if (key === "firstVisit") {
    const byDate = visitContext?.firstVisitMap?.[country.isoCode];
    if (byDate) return [String(byDate.getFullYear())];
    const fromSet = firstYearFromSet(vYearMap?.[country.isoCode]);
    return fromSet ? [fromSet] : [];
  }
  if (key === "lastVisit") {
    const byDate = visitContext?.lastVisitMap?.[country.isoCode];
    if (byDate) return [String(byDate.getFullYear())];
    const fromSet = lastYearFromSet(vYearMap?.[country.isoCode]);
    return fromSet ? [fromSet] : [];
  }
  const prop = country[key];
  if (Array.isArray(prop)) return prop.filter(Boolean).map(String);
  if (typeof prop === "string") return [prop];
  return [] as string[];
}

/**
 * Provides property name suggestions based on user input for property-based searching.
 * @param input - The current input string from the user.
 * @returns An array of suggested property names that match the input prefix.
 */
export function propertySuggestionProvider(input: string) {
  const supported = getSupportedProperties();
  const m = input.match(/^([a-zA-Z_]*)$/);
  if (!m) return [];
  const prefix = m[1].toLowerCase();
  return supported.filter((p) => p.startsWith(prefix));
}
