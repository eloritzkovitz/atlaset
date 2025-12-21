/**
 * @file Utility functions for generating dropdown options for trips filtering.
 */

import type { Country } from "@features/countries";
import {
  ALL_TRIP_CATEGORIES,
  ALL_TRIP_STATUSES,
  ALL_TRIP_TAGS,
} from "@features/trips/constants/trips";
import type { Trip, TripCategory, TripStatus, TripTag } from "@types";
import { extractUniqueValues } from "@utils/array";
import { toDropdownOptions } from "@utils/dropdown";
import { capitalizeWords } from "@utils/string";

/**
 * Gets country dropdown options for filtering.
 * @param countries - List of all countries.
 * @param usedCountryCodes - Set of country codes that have trips.
 * @returns An array of dropdown options with plain text labels.
 */
export function getCountryDropdownOptions(
  countries: Country[],
  usedCountryCodes: Set<string>
) {
  const filtered = countries
    .filter((c) => usedCountryCodes.has(c.isoCode))
    .sort((a, b) => a.name.localeCompare(b.name));
  return toDropdownOptions(
    filtered,
    (c) => c.isoCode,
    (c) => c.name
  );
}

/**
 * Gets year dropdown options for filtering.
 * @param usedYears - Array of years that have trips.
 * @returns An array of dropdown options.
 */
export function getYearDropdownOptions(usedYears: number[]) {
  const years = usedYears.map(String);
  return toDropdownOptions(years, (y) => y);
}

/**
 * Gets category dropdown options for filtering.
 * @param trips - Array of trips to extract categories from.
 * @returns An array of dropdown options.
 */
export function getCategoryDropdownOptions(trips: Trip[] = []) {
  const categories: TripCategory[] = extractUniqueValues(
    trips,
    (t) => t.categories,
    ALL_TRIP_CATEGORIES
  );
  return toDropdownOptions(
    categories,
    (c) => c,
    (c) => capitalizeWords(c.replace(/-/g, " "))
  );
}

/**
 * Gets status dropdown options for filtering.
 * @param trips - Array of trips to extract statuses from.
 * @returns An array of dropdown options.
 */
export function getStatusDropdownOptions(trips: Trip[] = []) {
  const statuses: TripStatus[] = extractUniqueValues(
    trips,
    (t) => t.status,
    ALL_TRIP_STATUSES
  );
  return toDropdownOptions<TripStatus>(statuses, (s) =>
    capitalizeWords(s.replace(/-/g, " "))
  );
}

/**
 * Gets tag dropdown options for filtering.
 * @param trips - Array of trips to extract tags from.
 * @returns An array of dropdown options.
 */
export function getTagDropdownOptions(trips: Trip[] = []) {
  const tags: TripTag[] = extractUniqueValues(
    trips,
    (t) => t.tags,
    ALL_TRIP_TAGS
  );
  return toDropdownOptions(
    tags,
    (t) => t,
    (t) => capitalizeWords(t.replace(/-/g, " "))
  );
}
