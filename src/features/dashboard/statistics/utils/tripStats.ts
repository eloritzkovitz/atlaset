/**
 * Utility functions for trip statistics.
 */

import type { Trip } from "@features/trips";
import { getTripDays } from "@features/trips/utils/trips";

/**
 * Finds the trip with the min or max duration, and/or returns the duration.
 * @param trips - Array of trips to analyze.
 * @param mode - 'min' or 'max'
 * @returns An object containing the trip with the extreme duration and the duration in days.
 */
function findExtremeTrip(
  trips: Trip[],
  mode: "min" | "max",
): { trip: Trip | null; duration: number } {
  if (!trips.length) return { trip: null, duration: 0 };
  const validTrips = trips.filter((trip) => {
    const days = getTripDays(trip);
    return days > 0;
  });
  if (!validTrips.length) return { trip: null, duration: 0 };
  let extremeTrip = validTrips[0];
  let extremeDuration = getTripDays(extremeTrip);
  for (let i = 1; i < validTrips.length; i++) {
    const days = getTripDays(validTrips[i]);
    if (
      (mode === "max" && days > extremeDuration) ||
      (mode === "min" && days < extremeDuration)
    ) {
      extremeTrip = validTrips[i];
      extremeDuration = days;
    }
  }
  return { trip: extremeTrip, duration: extremeDuration };
}

/**
 * Gets the longest trip duration in days from a list of trips.
 * @param trips - Array of trips to analyze.
 * @returns The longest trip duration in days.
 */
export function getLongestTrip(trips: Trip[]): number {
  return findExtremeTrip(trips, "max").duration;
}

/**
 * Gets the shortest trip duration in days from a list of trips.
 * @param trips - Array of trips to analyze.
 * @returns The shortest trip duration in days.
 */
export function getShortestTrip(trips: Trip[]): number {
  return findExtremeTrip(trips, "min").duration;
}

/**
 * Finds the trip object with the longest duration.
 * @param trips - Array of trips to analyze.
 * @returns The trip with the longest duration, or null if none.
 */
export function findLongestTrip(trips: Trip[]): Trip | null {
  return findExtremeTrip(trips, "max").trip;
}

/**
 * Finds the trip object with the shortest duration.
 * @param trips - Array of trips to analyze.
 * @returns The trip with the shortest duration, or null if none.
 */
export function findShortestTrip(trips: Trip[]): Trip | null {
  return findExtremeTrip(trips, "min").trip;
}

/**
 * Returns the first and last trip (by startDate) from a list of trips.
 * @param trips - Array of trips
 * @returns { firstTrip, lastTrip }
 */
export function getFirstAndLastTrip(trips: Trip[]): {
  firstTrip: Trip | null;
  lastTrip: Trip | null;
} {
  const sorted = trips
    .filter((trip) => typeof trip.startDate === "string" && trip.startDate)
    .sort(
      (a, b) =>
        new Date(a.startDate as string).getTime() -
        new Date(b.startDate as string).getTime(),
    );
  return {
    firstTrip: sorted[0] || null,
    lastTrip: sorted[sorted.length - 1] || null,
  };
}

/**
 * Returns the N most recent completed trips.
 * @param trips - Array of trips
 * @param count - Number of recent trips to return (default 3)
 * @returns Array of recent trips
 */
export function getRecentTrips(trips: Trip[], count: number = 3): Trip[] {
  const now = Date.now();
  return trips
    .filter(
      (trip) =>
        typeof trip.endDate === "string" &&
        trip.endDate &&
        new Date(trip.endDate).getTime() < now,
    )
    .sort(
      (a, b) =>
        new Date(b.startDate as string).getTime() -
        new Date(a.startDate as string).getTime(),
    )
    .slice(0, count);
}
