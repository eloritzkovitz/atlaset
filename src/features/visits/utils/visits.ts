/**
 * Utility functions for processing visit and trip data.
 */

import { FUTURE_TRIP_STATUSES } from "@features/trips/constants/trips";
import type { Trip } from "@features/trips/types";
import {
  getAutoTripStatus,
  isCompletedTrip,
} from "@features/trips/utils/trips";
import { extractUniqueValues, getYear } from "@utils";
import type { CategorizedVisits, Visit, VisitContext } from "../types";

/**
 * Collects unique country codes from trips based on a filter function, optionally including the home country.
 * @param trips - Array of trips to analyze.
 * @param filter - Function to filter trips for inclusion.
 * @param homeCountry - Optional home country code to include.
 * @returns Array of unique country codes.
 */
function getCountryCodesFromTrips(
  trips: Trip[],
  filter: (trip: Trip) => boolean,
  homeCountry?: string,
) {
  const codes = new Set<string>();

  trips.filter(filter).forEach((trip) => {
    trip.countryCodes?.forEach((code) => codes.add(code));
  });

  // Include home country if provided
  if (homeCountry) codes.add(homeCountry);

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
    [],
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
  homeCountry?: string,
) {
  return getCountryCodesFromTrips(
    trips,
    (trip) => {
      return isCompletedTrip(trip);
    },
    homeCountry,
  );
}

/**
 * Gets all country codes with future trips (after today).
 * @param trips - Array of trips to analyze.
 * @returns Array of country codes with future trips.
 */
export function getFutureVisitCountries(trips: Trip[]): string[] {
  const codes = trips
    .filter((trip) => FUTURE_TRIP_STATUSES.includes(getAutoTripStatus(trip)))
    .flatMap((trip) => trip.countryCodes ?? []);

  return Array.from(new Set(codes));
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
  homeCountry?: string,
) {
  return getCountryCodesFromTrips(
    trips,
    (trip) => {
      const start = getYear(trip.startDate);
      const end = getYear(trip.endDate) ?? start;
      return (
        start !== undefined && end !== undefined && year >= start && year <= end
      );
    },
    homeCountry,
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
export function getVisitCountsUpToYear(
  trips: Trip[],
  year: number,
  homeCountry?: string,
) {
  const now = new Date();
  const counts: Record<string, number> = {};

  trips.forEach((trip) => {
    const end = getYear(trip.endDate);
    if (
      end !== undefined &&
      end <= year &&
      trip.endDate &&
      isCompletedTrip(trip) &&
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
 * Gets all visits for a country, sorted by start date. Each visit includes the year range, trip name, and trip ID.
 * @param trips - Array of trips to analyze, sorted by start date.
 * @param isoCode - The ISO code of the country.
 * @returns Array of visits sorted by start date.
 */
export function getVisitsForCountry(trips: Trip[], isoCode: string): Visit[] {
  return trips
    .filter((trip) => trip.countryCodes?.includes(isoCode))
    .sort((a, b) => {
      if (a.startDate && b.startDate) {
        return (
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
      }
      if (a.startDate && !b.startDate) return -1;
      if (!a.startDate && b.startDate) return 1;
      return 0;
    })
    .map((trip) => ({
      yearRange: trip.startDate
        ? getYear(trip.startDate) +
          (trip.endDate && getYear(trip.endDate) !== getYear(trip.startDate)
            ? ` - ${getYear(trip.endDate)}`
            : "")
        : null,
      tripName: trip.name,
      tripId: trip.id,
      startDate: trip.startDate,
      endDate: trip.endDate,
    }));
}

/**
 * Categorizes visits by their current status.
 * @param visits - Visits to categorize.
 * @returns Visits grouped into past, upcoming, and tentative.
 */
export function categorizeVisits(visits: Visit[]): CategorizedVisits {
  const now = new Date();

  return {
    past: visits.filter(
      (visit) => visit.endDate && new Date(visit.endDate) < now,
    ),
    upcoming: visits.filter(
      (visit) => visit.startDate && new Date(visit.startDate) >= now,
    ),
    tentative: visits.filter((visit) => !visit.startDate),
  };
}

/**
 * Gets a mapping of country codes to their first visit date.
 * @param trips - Array of trips to analyze.
 * @returns Record of country code -> first visit date
 */
export function getFirstVisitDateByCountry(
  trips: Trip[],
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
    if (!trip.endDate || !trip.countryCodes || !isCompletedTrip(trip)) continue;

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
 * Gets a mapping of country codes to their next upcoming trip year (after today).
 * @param trips - Array of trips to analyze.
 * @returns Record of country code -> next upcoming year
 */
export function getNextUpcomingTripYearByCountry(
  trips: Trip[],
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
 * Build a per-country per-year presence map from trips. Each country code maps to a set of years in which it was visited.
 * @param trips - Array of trips to analyze.
 * @returns A mapping of country codes to sets of years visited.
 */
export function buildVisitedYearMap(trips: Trip[]) {
  const map: Record<string, Set<number>> = {};

  trips.forEach((trip) => {
    // Only consider completed trips for the visited year map
    if (!isCompletedTrip(trip)) return;

    // Determine the start and end years for the trip
    const startYear = trip.startDate
      ? new Date(trip.startDate).getFullYear()
      : undefined;
    const endYear = trip.endDate
      ? new Date(trip.endDate).getFullYear()
      : startYear;

    if (startYear === undefined || endYear === undefined) return;

    // Add each year in the range to the map for each country code
    for (let y = startYear; y <= endYear; y++) {
      trip.countryCodes.forEach((code) => {
        map[code] = map[code] || new Set<number>();
        map[code].add(y);
      });
    }
  });

  return map;
}

/**
 * Compute visit counts per ISO from a VisitedYearMap up to (and including) a given year.
 * Optionally restrict counting to a provided set of years.
 * @param visitedYearMap - The mapping of country codes to sets of years.
 * @param selectedYear - The year up to which to count visits.
 * @param years - Optional array of years to restrict counting.
 * @returns An object mapping country codes to visit counts.
 */
export function computeVisitCountsFromYearMap(
  visitedYearMap: Record<string, Set<number>>,
  selectedYear: number,
  years?: number[],
) {
  const counts: Record<string, number> = {};
  const yearSet = years && years.length > 0 ? new Set(years) : undefined;
  for (const iso of Object.keys(visitedYearMap)) {
    const yearsForIso = Array.from(visitedYearMap[iso] || []);
    const count = yearsForIso.filter(
      (y) => y <= selectedYear && (yearSet ? yearSet.has(y) : true),
    ).length;
    if (count > 0) counts[iso] = count;
  }
  return counts;
}

export function getVisitCountStats(trips: Trip[], year: number) {
  const map = getVisitCountsUpToYear(trips, year);
  const counts = Object.values(map);

  return {
    map,
    min: counts.length > 0 ? Math.min(...counts) : 1,
    max: counts.length > 0 ? Math.max(...counts) : 1,
  };
}

/**
 * Builds a VisitContext object from trips, optionally filtered by a selected year and home country.
 * @param trips - Array of trips to analyze.
 * @param selectedYear - Optional year to filter trips.
 * @param homeCountry - Optional home country code to include in the context.
 * @returns A VisitContext object containing visited ISO codes, visit maps, and first/last visit dates.
 */
export function buildVisitContext(
  trips: Trip[],
  selectedYear?: number,
  homeCountry?: string,
): VisitContext {
  const visitedYearMap = buildVisitedYearMap(trips);
  const firstVisitMap = getFirstVisitDateByCountry(trips);
  const lastVisitMap = getLastVisitDateByCountry(trips);
  const years = getYearsFromTrips(trips);

  // Default to provided selectedYear, otherwise use the latest year not greater than current year
  const currentYear = new Date().getFullYear();
  const latestDetected = getLatestYear(years);
  const yearToUse = selectedYear ?? Math.min(latestDetected, currentYear);
  const visitedMap = computeVisitCountsFromYearMap(
    visitedYearMap,
    yearToUse,
    years,
  );

  if (homeCountry) visitedMap[homeCountry] = (visitedMap[homeCountry] || 0) + 1;
  const visitedIsoCodes = Object.keys(visitedMap);
  return {
    visitedIsoCodes,
    visitedMap,
    visitedYearMap,
    firstVisitMap,
    lastVisitMap,
  };
}
