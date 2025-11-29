/**
 * @file Utility functions for trip data manipulation.
 */

import type { Trip } from "@types";
import { extractUniqueValues } from "@utils/array";

/**
 * Gets all country codes that have trips associated with them.
 * @param trips - An array of trips
 * @returns a set of country codes.
 */
export function getUsedCountryCodes(trips: Trip[]): Set<string> {
  return new Set(extractUniqueValues(trips, (trip) => trip.countryCodes, []));
}

/**
 * Gets all years that have trips associated with them.
 * @param trips - An array of trips
 * @returns an array of years.
 */
export function getUsedYears(trips: Trip[]): number[] {
  const years = extractUniqueValues(
    trips,
    (trip) =>
      trip.startDate ? new Date(trip.startDate).getFullYear() : undefined,
    []
  );
  return years.sort((a, b) => b - a);
}
