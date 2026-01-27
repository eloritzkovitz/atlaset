/**
 * @file Utility functions for trip statistics.
 */

import type { Trip } from "@features/trips";
import {
  getAbroadTrips,
  getCompletedTrips,
  getTripDays,
} from "@features/trips/utils/trips";
import { getVisitedCountriesUpToYear } from "@features/visits";

/**
 * Gets a list of unique country codes visited across all trips.
 * @param trips - Array of trips to analyze.
 * @returns An array of unique country codes visited.
 */
export function getCountriesVisited(trips: Trip[]): string[] {
  return Array.from(new Set(trips.flatMap((trip) => trip.countryCodes ?? [])));
}

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
 * Gets the number of trips per country.
 * @param trips - Array of trips to analyze.
 * @returns A record mapping country codes to the number of trips.
 */
export function getTripsPerCountry(trips: Trip[]): Record<string, number> {
  const counts: Record<string, number> = {};
  trips.forEach((trip) => {
    (trip.countryCodes ?? []).forEach((code) => {
      counts[code] = (counts[code] || 0) + 1;
    });
  });
  return counts;
}

/**
 * Returns a sorted array of years a country was visited.
 */
export function getVisitYearsForCountry(
  trips: Trip[],
  countryCode: string,
): number[] {
  return Array.from(
    new Set(
      trips
        .filter(
          (trip) =>
            trip.countryCodes?.includes(countryCode) &&
            typeof trip.startDate === "string" &&
            trip.startDate,
        )
        .map((trip) => new Date(trip.startDate as string).getFullYear()),
    ),
  ).sort((a, b) => a - b);
}

/**
 * Gets the longest trip duration in days from a list of trips.
 * @param trips - Array of trips to analyze.
 * @returns The longest trip duration in days.
 */
export function getLongestTrip(trips: Trip[]): number {
  return trips.reduce((max, trip) => {
    const days = getTripDays(trip);
    return days > max ? days : max;
  }, 0);
}

/**
 * Gets the shortest trip duration in days from a list of trips.
 * @param trips - Array of trips to analyze.
 * @returns The shortest trip duration in days.
 */
export function getShortestTrip(trips: Trip[]): number {
  const now = Date.now();
  const durations = trips
    .filter((trip) => {
      if (
        trip.status !== "completed" ||
        typeof trip.startDate !== "string" ||
        typeof trip.endDate !== "string" ||
        !trip.startDate ||
        !trip.endDate
      ) {
        return false;
      }
      const start = new Date(trip.startDate).getTime();
      const end = new Date(trip.endDate).getTime();
      return end > start && end < now;
    })
    .map(getTripDays)
    .filter((days) => days > 0);
  return durations.length > 0 ? Math.min(...durations) : 0;
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
