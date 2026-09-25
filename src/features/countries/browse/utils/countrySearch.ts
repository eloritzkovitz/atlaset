/**
 * Utility functions for searching and filtering countries based on their properties.
 */

import { suggestByPrefix } from "@utils";
import {
  COUNTRY_QUALIFIER_MAP,
  SUPPORTED_QUALIFIERS,
} from "../constants/qualifierConfig";
import type { CountryQualifierConfig } from "../types";
import type { Country } from "../../types";

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
 * @returns A string that combines the country's name and alternative names for search purposes.
 */
export function buildSearchString(country: Country) {
  return [country.name, ...(country.altNames ?? [])].join(" ");
}
