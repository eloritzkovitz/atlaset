/**
 * Utility functions for searching and filtering countries based on their properties.
 */

import { TRANSCONTINENTAL_MAP } from "../constants/transcontinental";
import type { Country } from "../types";

/** Represents a key for a country property search. */
export type CountryPropertyKey =
  | keyof Country
  | "sovereign"
  | "visited"
  | "visits"
  | "visityear"
  | "firstvisit";

/** Configuration for a country property search. */
export type CountryPropertyConfig = {
  key: CountryPropertyKey;
  includeTC?: boolean;
};

const COUNTRY_PROPERTY_MAP: Record<string, CountryPropertyConfig> = {
  isocode: { key: "isoCode" },
  region: { key: "region" },
  region_tc: { key: "region", includeTC: true },
  subregion: { key: "subregion" },
  subregion_tc: { key: "subregion", includeTC: true },
  capital: { key: "capital" },
  currency: { key: "currency" },
  language: { key: "languages" },
  callingcode: { key: "callingCode" },
  sovereignty: { key: "sovereigntyType" },
  sovereign: { key: "sovereign" },
  visited: { key: "visited" },
  visits: { key: "visits" },
  visityear: { key: "visityear" },
  firstvisit: { key: "firstvisit" },
};

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
 * Return searchable tokens for a specific country property. Includes transcontinental overrides when requested.
 */
export function getPropertyTokens(
  country: Country,
  key: CountryPropertyKey,
  includeTC?: boolean,
  visitedIsoCodes?: string[],
  visitedMap?: Record<string, number>,
  visitedYearMap?: Record<string, Set<number>>,
) {
  if (key === "region" || key === "subregion") {
    const tokens: string[] = [];
    const val = country[key];
    if (typeof val === "string" && val) tokens.push(val);
    if (includeTC) {
      const extra = TRANSCONTINENTAL_MAP.get(
        country.isoCode?.toUpperCase?.() ?? "",
      );
      const extraVal =
        key === "region" ? extra?.additionalRegion : extra?.additionalSubregion;
      if (typeof extraVal === "string") tokens.push(extraVal);
    }
    return tokens;
  }
  if (key === "sovereign") {
    return [country.sovereigntyType === "Sovereign" ? "true" : "false"];
  }
  if (key === "visited") {
    if (!visitedIsoCodes) return [];
    return [visitedIsoCodes.includes(country.isoCode) ? "true" : "false"];
  }
  if (key === "visits") {
    if (visitedMap) {
      const count = visitedMap[country.isoCode] || 0;
      return [String(count)];
    }
    return [];
  }
  if (key === "visityear") {
    if (visitedYearMap) {
      const yearsSet = visitedYearMap[country.isoCode];
      const years = yearsSet ? Array.from(yearsSet).map(String) : [];
      return years;
    }
    return [];
  }
  if (key === "firstvisit") {
    if (visitedYearMap) {
      const yearsSet = visitedYearMap[country.isoCode];
      const years = yearsSet ? Array.from(yearsSet).map((y) => Number(y)) : [];
      if (years.length === 0) return [];
      const first = Math.min(...years);
      return [String(first)];
    }
    return [];
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
