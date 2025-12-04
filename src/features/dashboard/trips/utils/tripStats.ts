/**
 * @fileoverview Utility functions for trip statistics.
 */

import { getTripDays } from "@features/trips/utils/trips";
import type { Trip } from "@types";

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
    .filter(([_, count]) => count === maxCount)
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
  countryCode: string
): number[] {
  return Array.from(
    new Set(
      trips
        .filter((trip) => trip.countryCodes?.includes(countryCode))
        .map((trip) => new Date(trip.startDate).getFullYear())
    )
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
  const durations = trips.map(getTripDays).filter((days) => days > 0);
  return durations.length > 0 ? Math.min(...durations) : 0;
}
