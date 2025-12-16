/**
 * @file Utility functions for processing visit and trip data.
 */

import type { Trip } from "@types";
import { extractUniqueValues } from "@utils/array";
import { getYear, getYearNumber } from "@utils/date";

/**
 * Adds a given home country to a set of country codes.
 * @param codes - Set of country codes.
 * @param homeCountry - Optional home country code to add.
 * @returns The updated set of country codes.
 */
function addHomeCountry(codes: Set<string>, homeCountry?: string) {
  if (homeCountry) codes.add(homeCountry);
  return codes;
}

/**
 * Helper to collect unique country codes from trips matching a filter.
 */
function collectCountryCodes(
  trips: Trip[],
  filter: (trip: Trip) => boolean,
  homeCountry?: string
) {
  const codes = new Set<string>();
  trips.filter(filter).forEach((trip) => {
    trip.countryCodes?.forEach((code) => codes.add(code));
  });
  addHomeCountry(codes, homeCountry);
  return Array.from(codes);
}

/**
 * Gets all years from trips.
 * @param trips - Array of trips to analyze.
 * @returns Array of unique years sorted in ascending order.
 */
export function getYearsFromTrips(trips: Trip[]) {
  const allYears = extractUniqueValues(
    trips,
    (trip) => (trip.endDate ? new Date(trip.endDate).getFullYear() : undefined),
    []
  );
  return allYears.sort((a, b) => a - b);
}

/**
 * Gets the latest year from an array of years.
 * @param years - Array of years.
 * @returns The latest year or the current year if the array is empty.
 */
export function getLatestYear(years: number[]): number {
  return years.length > 0 ? years[years.length - 1] : new Date().getFullYear();
}

/**
 * Computes a list of unique visited country codes from an array of trips, including home country if provided.
 * @param trips - The array of trips.
 * @param homeCountry - Optional home country code to include.
 * @returns A list of unique visited country codes.
 */
export function computeVisitedCountriesFromTrips(
  trips: Trip[],
  homeCountry?: string
) {
  const now = new Date();
  return collectCountryCodes(
    trips,
    (trip) => {
      const end = trip.endDate ? new Date(trip.endDate) : undefined;
      return !!(end && !isNaN(end.getTime()) && end <= now);
    },
    homeCountry
  );
}

/**
 * Gets all visits for a country.
 * @param trips - Array of trips to analyze, sorted by start date.
 * @param isoCode - The ISO code of the country.
 * @returns Array of visits sorted by start date.
 */
export function getVisitsForCountry(trips: Trip[], isoCode: string) {
  return trips
    .filter((trip) => trip.countryCodes?.includes(isoCode))
    .sort((a, b) => {
      // Sort by start date ascending
      if (a.startDate && b.startDate) {
        return (
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
      }  
      // Handle cases where start date is missing    
      if (a.startDate && !b.startDate) return -1;
      if (!a.startDate && b.startDate) return 1;
      return 0; // Both missing start date
    })
    .map((trip) => ({
      yearRange: trip.startDate
        ? getYear(trip.startDate) +
          (trip.endDate && getYear(trip.endDate) !== getYear(trip.startDate)
            ? ` - ${getYear(trip.endDate)}`
            : "")
        : "TBD",
      tripName: trip.name,
      startDate: trip.startDate,
      endDate: trip.endDate,
    }));
}

/**
 * Gets a mapping of country codes to their first visit date.
 * @param trips - Array of trips to analyze.
 * @returns Record of country code -> first visit date
 */
export function getFirstVisitDateByCountry(
  trips: Trip[]
): Record<string, Date> {
  const map: Record<string, Date> = {};
  for (const trip of trips) {
    if (!trip.endDate || !trip.countryCodes) continue;
    const end = new Date(trip.endDate);
    for (const code of trip.countryCodes) {
      if (!map[code] || end < map[code]) {
        map[code] = end;
      }
    }
  }
  return map;
}

/**
 * Gets a mapping of country codes to their last visit date.
 * @param trips - Array of trips to analyze.
 * @returns Record of country code -> last visit date
 */
export function getLastVisitDateByCountry(trips: Trip[]): Record<string, Date> {
  const map: Record<string, Date> = {};
  for (const trip of trips) {
    if (!trip.endDate || !trip.countryCodes) continue;
    const end = new Date(trip.endDate);
    for (const code of trip.countryCodes) {
      if (!map[code] || end > map[code]) {
        map[code] = end;
      }
    }
  }
  return map;
}

/**
 * Gets all visited country codes for a specific year, including home country if provided.
 * @param trips - Array of trips to analyze.
 * @param year - The year for which to get visited countries.
 * @param homeCountry - Optional home country code to include.
 * @returns Array of unique country codes visited in the specified year.
 */
export function getVisitedCountriesForYear(
  trips: Trip[],
  year: number,
  homeCountry?: string
) {
  return collectCountryCodes(
    trips,
    (trip) => {
      const start = getYearNumber(trip.startDate);
      const end = getYearNumber(trip.endDate) ?? start;
      return (
        start !== undefined && end !== undefined && year >= start && year <= end
      );
    },
    homeCountry
  );
}

/**
 * Gets a mapping of country codes to number of visits up to and including a specific year,
 * including home country if provided.
 * @param trips - Array of trips to analyze.
 * @param year - The year up to which to include trips.
 * @param homeCountry - Optional home country code to include.
 * @returns An object mapping country codes to visit counts.
 */
export function getVisitedCountriesUpToYear(
  trips: Trip[],
  year: number,
  homeCountry?: string
) {
  const now = new Date();
  const counts: Record<string, number> = {};
  trips.forEach((trip) => {
    const end = getYearNumber(trip.endDate);
    if (
      end !== undefined &&
      end <= year &&
      trip.endDate &&
      new Date(trip.endDate) <= now
    ) {
      trip.countryCodes?.forEach((code) => {
        counts[code] = (counts[code] || 0) + 1;
      });
    }
  });
  if (homeCountry) {
    counts[homeCountry] = (counts[homeCountry] || 0) + 1;
  }
  return counts;
}

/**
 * Gets a mapping of country codes to their next upcoming trip year (after today).
 * @param trips - Array of trips to analyze.
 * @returns Record of country code -> next upcoming year
 */
export function getNextUpcomingTripYearByCountry(
  trips: Trip[]
): Record<string, number | undefined> {
  const now = new Date();
  const nextYearByCountry: Record<string, number | undefined> = {};
  for (const trip of trips) {
    const end = trip.endDate ? new Date(trip.endDate) : undefined;
    if (end && end > now) {
      const year = end.getFullYear();
      for (const code of trip.countryCodes || []) {
        if (!nextYearByCountry[code] || year < nextYearByCountry[code]) {
          nextYearByCountry[code] = year;
        }
      }
    }
  }
  return nextYearByCountry;
}

/**
 * Gets visit count statistics for trips up to a specific year.
 * @param trips - Array of trips to analyze.
 * @param year - The year up to which to include trips.
 * @returns An object containing the visit count map, minimum, and maximum counts.
 */
export function getVisitCountStats(trips: Trip[], year: number) {
  const map = getVisitedCountriesUpToYear(trips, year, undefined);
  const counts = Object.values(map);
  return {
    map,
    min: counts.length > 0 ? Math.min(...counts) : 1,
    max: counts.length > 0 ? Math.max(...counts) : 1,
  };
}
