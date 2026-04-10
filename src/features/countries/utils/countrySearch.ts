/**
 * Utility functions for searching and filtering countries based on their properties.
 */

import type { VisitContext } from "@features/visits";
import { suggestByPrefix } from "@utils/search";
import {
  COUNTRY_QUALIFIER_MAP,
  SUPPORTED_QUALIFIERS,
  type CountryQualifierKey,
  type CountryQualifierConfig,
} from "../constants/qualifierConfig";
import { TRANSCONTINENTAL_MAP } from "../constants/transcontinental";
import type { Country, TranscontinentalScope } from "../types";

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
 * Provides qualifier name suggestions based on user input for qualifier-based searching.
 * @input The current user input for the qualifier, used to generate suggestions.
 */
export function qualifierSuggestionProvider(input: string) {
  return suggestByPrefix(SUPPORTED_QUALIFIERS, input);
}

/**
 * Builds a search string for a country by concatenating relevant properties.
 * @param country - The country object to build the search string from.
 * @returns A string that combines the country's name and aliases for search purposes.
 */
export function buildSearchString(country: Country) {
  return [country.name, ...(country.aliases ?? [])].join(" ");
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
  options?: {
    tcOption?: { scope?: TranscontinentalScope; mode?: string };
    visitContext?: VisitContext;
  },
) {
  const { tcOption, visitContext } = options ?? {};

  // Determine if transcontinental countries should be included based on the provided options
  const includeTC: TranscontinentalScope | boolean = tcOption
    ? tcOption.mode === "include" || tcOption.scope === "all"
      ? true
      : (tcOption.scope ?? false)
    : false;
  const vIso = visitContext?.visitedIsoCodes;

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
      if (extraVal) {
        const entryScope = extra?.scope ?? "contiguous";
        if (includeTC === true || includeTC === entryScope)
          tokens.push(extraVal);
      }
    }
    return tokens;
  }
  if (key === "tc") {
    const entry = TRANSCONTINENTAL_MAP.get(
      country.isoCode?.toUpperCase?.() ?? "",
    );
    if (entry) return ["true", entry.scope ?? "contiguous"];
    return ["false"];
  }
  if (key === "sovereign") {
    return [country.sovereigntyType === "Sovereign" ? "true" : "false"];
  }
  if (key === "visited")
    return vIso ? [vIso.includes(country.isoCode) ? "true" : "false"] : [];
  const prop = country[key];
  if (Array.isArray(prop)) return prop.filter(Boolean).map(String);
  if (typeof prop === "string") return [prop];
  return [] as string[];
}
