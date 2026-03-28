/**
 * Utility functions for searching and filtering countries based on their properties.
 */

import type { VisitContext } from "@features/visits";
import {
  COUNTRY_QUALIFIER_MAP,
  type CountryQualifierKey,
  type CountryQualifierConfig,
} from "../constants/qualifierConfig";
import { TRANSCONTINENTAL_MAP } from "../constants/transcontinental";
import type { Country } from "../types";

/**
 * Resolves a qualifier configuration based on a given qualifier name.
 * This is used to determine how to filter countries based on user input in the format "qualifier:query".
 * @param qualifier - The qualifier name to resolve.
 * @returns The qualifier configuration or undefined if not found.
 */
export function resolveQualifierConfig(
  qualifier: string,
): CountryQualifierConfig | undefined {
  return COUNTRY_QUALIFIER_MAP[qualifier.toLowerCase()];
}

/**
 * Returns a list of supported qualifier names for searching.
 * @returns An array of supported qualifier names.
 */
export function getSupportedQualifiers() {
  return Object.keys(COUNTRY_QUALIFIER_MAP);
}

/**
 * Parses a search string for qualifier-based searching.
 * @param input - The search string input by the user.
 * @returns An object containing the qualifier and query if the input matches the expected format, otherwise null.
 */
export function parseQualifierSearch(input: string) {
  const m = input.trim().match(/^([a-zA-Z_]+):\s*(.+)$/i);
  if (!m) return null;
  return { qualifier: m[1].toLowerCase(), query: m[2] };
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
 * Return searchable tokens for a specific country qualifier. Includes transcontinental countries when requested.
 * @param country - The country to extract tokens from.
 * @param key - The qualifier key to extract.
 * @param options - Additional options for token extraction.
 * @returns An array of strings representing the tokens for the specified qualifier of the country.
 * @see CountryQualifierKey for supported keys and special handling.
 */
export function getQualifierTokens(
  country: Country,
  key: CountryQualifierKey,
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
 * Provides qualifier name suggestions based on user input for qualifier-based searching.
 * @param input - The current input string from the user.
 * @returns An array of suggested qualifier names that match the input prefix.
 */
export function qualifierSuggestionProvider(input: string) {
  const supported = getSupportedQualifiers();
  const m = input.match(/^([a-zA-Z_]*)$/);
  if (!m) return [];
  const prefix = m[1].toLowerCase();
  return supported.filter((p) => p.startsWith(prefix));
}
