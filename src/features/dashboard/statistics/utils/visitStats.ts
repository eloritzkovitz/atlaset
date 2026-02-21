/**
 * @file Utility functions for visit statistics.
 */

import type { Trip } from "@features/trips";
import { getAbroadTrips, getCompletedTrips } from "@features/trips/utils/trips";
import { getVisitedCountriesUpToYear } from "@features/visits";

/**
 * Gets the most visited countries from a list of trips.
 * @param trips - Array of trips to analyze.
 * @param homeCountry - The home country code to exclude from abroad counts.
 * @returns An object containing the most visited country codes and their visit count.
 */
export function getMostVisitedCountries(trips: Trip[], homeCountry: string) {
  const countryCounts: Record<string, number> = {};
  trips.forEach((trip) => {
    (trip.countryCodes ?? [])
      .filter((code) => code !== homeCountry)
      .forEach((code) => {
        countryCounts[code] = (countryCounts[code] || 0) + 1;
      });
  });
  const maxCount = Math.max(...Object.values(countryCounts), 0);
  const codes = Object.entries(countryCounts)
    .filter(([, count]) => count === maxCount)
    .map(([code]) => code);
  return { codes, maxCount };
}

/**
 * Gets the set of unique abroad countries visited in completed trips
 * @param trips - Array of user trips
 * @param homeCountry - The user's home country code
 * @returns Set of unique abroad country codes
 */
export function getUniqueAbroadCountries(
  trips: Trip[],
  homeCountry: string,
): Set<string> {
  const abroadTrips = getCompletedTrips(getAbroadTrips(trips, homeCountry));
  return new Set(
    abroadTrips.flatMap((t) => t.countryCodes.filter((c) => c !== homeCountry)),
  );
}

/**
 * Gets the count of countries with at least X visits across all trips
 * @param trips - Array of user trips
 * @param minVisits - Minimum number of visits to count (default 2)
 * @returns Number of countries with at least minVisits visits
 */
export function getRepeatVisitCount(
  trips: Trip[],
  minVisits: number = 2,
): number {
  const visitCounts = getVisitedCountriesUpToYear(
    getCompletedTrips(trips),
    9999,
  );
  return Object.values(visitCounts).filter((count) => count >= minVisits)
    .length;
}
