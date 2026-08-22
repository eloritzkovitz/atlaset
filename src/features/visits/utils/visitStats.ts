/**
 * Utility functions for visit statistics.
 */

import type { Trip } from "@features/trips/types";
import {
  buildVisitedYearMap,
  computeVisitCountsFromYearMap,
  getVisitCountsUpToYear,
} from "./visits";

/**
 * Gets the most visited abroad countries from a list of trips.
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
 * Gets visit count statistics up to a specified year from a list of trips.
 * @param trips - Array of trips to analyze.
 * @param year - The year up to which to count visits.
 * @returns An object containing a map of visit counts by country, and the minimum and maximum visit counts.
 */
export function getVisitCountStats(trips: Trip[], year: number) {
  const map = getVisitCountsUpToYear(trips, year);
  const counts = Object.values(map);

  return {
    map,
    min: counts.length > 0 ? Math.min(...counts) : 1,
    max: counts.length > 0 ? Math.max(...counts) : 1,
  };
}
