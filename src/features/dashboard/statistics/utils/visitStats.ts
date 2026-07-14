/**
 * Utility functions for visit statistics.
 */

import type { Country } from "@features/countries/types";
import type { Trip } from "@features/trips";
import { getCompletedTrips } from "@features/trips/utils/trips";
import {
  buildVisitedYearMap,
  computeVisitCountsFromYearMap,
} from "@features/visits/utils/visits";

/**
 * Counts how many countries in the given list have been visited based on the provided function.
 * @param countries - List of countries to check.
 * @param isVisitedCountry - Function that takes a country ISO code and returns whether it has been visited.
 * @returns The count of visited countries in the list.
 */
export function countVisited(
  countries: Country[],
  isVisitedCountry: (iso: string) => boolean,
): number {
  return countries.filter((c) => isVisitedCountry(c.isoCode)).length;
}

/**
 * Gets the most visited countries from a list of trips.
 * @param trips - Array of trips to analyze.
 * @param homeCountry - The home country code to exclude from abroad counts.
 * @returns An object containing the most visited country codes and their visit count.
 */
export function getMostVisitedCountries(trips: Trip[], homeCountry: string) {
  const visitedYearMap = buildVisitedYearMap(trips);
  const countryCounts = computeVisitCountsFromYearMap(visitedYearMap, 9999);
  // exclude homeCountry when determining most visited abroad
  if (homeCountry) delete countryCounts[homeCountry];
  const maxCount = Object.values(countryCounts).length
    ? Math.max(...Object.values(countryCounts))
    : 0;
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
  const visitedYearMap = buildVisitedYearMap(trips);
  const counts = computeVisitCountsFromYearMap(visitedYearMap, 9999);
  return new Set(Object.keys(counts).filter((c) => c !== homeCountry));
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
  const completed = getCompletedTrips(trips);
  const visitedYearMap = buildVisitedYearMap(completed);
  const visitCounts = computeVisitCountsFromYearMap(visitedYearMap, 9999);
  return Object.values(visitCounts).filter((count) => count >= minVisits)
    .length;
}
