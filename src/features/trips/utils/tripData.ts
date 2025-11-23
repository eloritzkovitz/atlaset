/**
 * @file Utility functions for trip data manipulation.
 */

import type { Trip } from "@types";

/**
 * Gets all country codes that have trips associated with them.
 * @param trips - An array of trips
 * @returns a set of country codes.
 */
export function getUsedCountryCodes(trips: Trip[]): Set<string> {
  return new Set(trips.flatMap((trip) => trip.countryCodes));
}

/**
 * Gets all years that have trips associated with them.
 * @param trips - An array of trips
 * @returns an array of years.
 */
export function getUsedYears(trips: Trip[]): number[] {
  return Array.from(
    new Set(
      trips
        .map((trip) => trip.startDate && new Date(trip.startDate).getFullYear())
        .filter((y): y is number => typeof y === "number")
    )
  ).sort((a, b) => b - a);
}
