/**
 * @fileoverview Utility functions for trips.
 */

import type { Trip, TripStatus } from "@types";

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
  return trip.status === "completed";
}

/**
 * Determines if a trip is upcoming based on its start date.
 * @param trip - The trip object to evaluate.
 * @returns True if the trip is upcoming, false otherwise.
 */
export function isUpcomingTrip(trip: Trip): boolean {
  return !!trip.startDate && new Date(trip.startDate) > new Date();
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
  return trips.filter(isUpcomingTrip);
}

/**
 * Gets a filtered list of completed trips.
 * @param trips - Array of trips to analyze.
 * @returns An array of completed trips.
 */
export function getCompletedTrips(trips: Trip[]): Trip[] {
  return trips.filter((trip) => isCompletedTrip(trip));
}

/**
 * Gets the automatic status of a trip based on current date and trip dates.
 * @param trip - The trip object.
 * @returns The automatic status of the trip.
 */
export function getAutoTripStatus(trip: Trip): TripStatus {
  const now = new Date();
  const start = trip.startDate ? new Date(trip.startDate) : null;
  const end = trip.endDate ? new Date(trip.endDate) : null;

  if (!start || !end) return trip.status || "planned";
  if (now < start) return "planned";
  if (now >= start && now <= end) return "in-progress";
  if (now > end) return "completed";
  return trip.status || "planned";
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
  // Add 1 to include both start and end dates
  return (
    Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  );
}
