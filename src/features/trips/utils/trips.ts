/**
 * Utility functions for trips.
 */

import type { Trip, TripStatus } from "../types";

/**
 * Checks if a trip has a valid start date.
 * @param trip - The trip object to evaluate.
 * @returns True if the trip has a valid start date, false otherwise.
 */
export function hasValidStartDate(trip: Trip) {
  if (
    !trip.startDate ||
    typeof trip.startDate !== "string" ||
    trip.startDate.trim() === ""
  )
    return false;
  const start = new Date(trip.startDate);
  return !isNaN(start.getTime());
}

/**
 * Calculates the number of trip days (inclusive of start and end date).
 * @param trip - The trip object with startDate and endDate.
 * @returns The number of trip days, or 0 if dates are missing.
 */
export function getTripDays(trip: Trip): number {
  if (!trip.startDate || !trip.endDate) return 0;
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
  // Add 1 to include both start and end dates
  return (
    Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  );
}

/**
 * Gets the automatic status of a trip based on current date and trip dates.
 * @param trip - The trip object.
 * @returns The automatic status of the trip.
 */
export function getAutoTripStatus(trip: Trip): TripStatus {
  // If the user manually saved a status, respect it as the absolute source of truth
  if (trip.status === "completed" || trip.status === "planned") {
    return trip.status;
  }

  // If the trip has no valid start date, consider it planned
  if (!hasValidStartDate(trip)) return "planned";

  // If the trip has a valid start date, determine its status based on current date
  const now = new Date();
  const start = new Date(trip.startDate!);
  let end: Date | null = null;
  if (trip.endDate) {
    end = new Date(trip.endDate);
    end.setHours(23, 59, 59, 999);
  }

  if (now < start) return "upcoming";
  if (end && now >= start && now <= end) return "in-progress";
  if (end && now > end) return "completed";

  return "planned";
}

/**
 * Determines if a trip is local (within the home country).
 * @param trip - The trip object to evaluate.
 * @param homeCountry - The home country code to compare against.
 * @returns True if the trip is local, false otherwise.
 */
export function isLocalTrip(trip: Trip, homeCountry: string) {
  return (
    trip.countryCodes &&
    trip.countryCodes.length > 0 &&
    trip.countryCodes.every((code) => code === homeCountry)
  );
}

/**
 * Determines if a trip is abroad (outside the home country).
 * @param trip - The trip object to evaluate.
 * @param homeCountry - The home country code to compare against.
 * @returns True if the trip is abroad, false otherwise.
 */
export function isAbroadTrip(trip: Trip, homeCountry: string) {
  return (
    trip.countryCodes && trip.countryCodes.some((code) => code !== homeCountry)
  );
}

/**
 * Gets whether a trip is completed.
 * @param trip - The trip object to evaluate.
 * @returns True if the trip is completed, false otherwise.
 */
export function isCompletedTrip(trip: Trip) {
  return trip.status === "completed" || getAutoTripStatus(trip) === "completed";
}

/**
 * Determines if a trip is planned (a future trip with tentative dates).
 * @param trip - The trip object to evaluate.
 * @returns True if the trip is planned, false otherwise.
 */
export function isPlannedTrip(trip: Trip): boolean {
  return getAutoTripStatus(trip) === "planned";
}

/**
 * Determines if a trip is upcoming (a future trip with definite dates).
 * @param trip - The trip object to evaluate.
 * @returns True if the trip is upcoming, false otherwise.
 */
export function isUpcomingTrip(trip: Trip): boolean {
  return getAutoTripStatus(trip) === "upcoming";
}

/**
 * Determines if a trip is in progress (occurring now).
 * @param trip - The trip object to evaluate.
 * @returns True if the trip is in progress, false otherwise.
 */
export function isInProgressTrip(trip: Trip): boolean {
  return getAutoTripStatus(trip) === "in-progress";
}

/**
 * Gets a filtered list of local trips.
 * @param trips - Array of trips to analyze.
 * @param homeCountry - The home country code to determine local trips.
 * @returns An array of local trips.
 */
export function getLocalTrips(trips: Trip[], homeCountry: string): Trip[] {
  return trips.filter((trip) => isLocalTrip(trip, homeCountry));
}

/**
 * Gets a filtered list of abroad trips.
 * @param trips - Array of trips to analyze.
 * @param homeCountry - The home country code to determine abroad trips.
 * @returns An array of abroad trips.
 */
export function getAbroadTrips(trips: Trip[], homeCountry: string): Trip[] {
  return trips.filter((trip) => isAbroadTrip(trip, homeCountry));
}

/**
 * Gets a filtered list of upcoming trips.
 * @param trips - Array of trips to analyze.
 * @returns An array of upcoming trips.
 */
export function getUpcomingTrips(trips: Trip[]): Trip[] {
  return trips.filter((trip) => isUpcomingTrip(trip) || isInProgressTrip(trip));
}

/**
 * Gets a filtered list of planned trips.
 * @param trips - Array of trips to analyze.
 * @returns An array of planned trips.
 */
export function getPlannedTrips(trips: Trip[]): Trip[] {
  return trips.filter(isPlannedTrip);
}

/**
 * Gets a filtered list of completed trips.
 * @param trips - Array of trips to analyze.
 * @returns An array of completed trips.
 */
export function getCompletedTrips(trips: Trip[]): Trip[] {
  return trips.filter((trip) => isCompletedTrip(trip));
}
