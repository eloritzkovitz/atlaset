/**
 * Utility functions for working with trip overrides.
 */

import type { Trip } from "../../core/types";
import type { TripOverrides } from "../types";

/** Checks if two arrays are equal. */
function arraysEqual<T>(
  first: T[] | undefined,
  second: T[] | undefined,
): boolean {
  if (first === second) {
    return true;
  }

  if (!first || !second) {
    return false;
  }

  return (
    first.length === second.length &&
    first.every((value, index) => value === second[index])
  );
}

/** Returns only the personal trip fields that differ from the canonical trip. */
export function getTripOverrides(trip: Trip, editedTrip: Trip): TripOverrides {
  const overrides: TripOverrides = {};

  if (!arraysEqual(trip.countryCodes, editedTrip.countryCodes)) {
    overrides.countryCodes = editedTrip.countryCodes;
  }

  if (!arraysEqual(trip.locationIds, editedTrip.locationIds)) {
    overrides.locationIds = editedTrip.locationIds;
  }

  if (trip.startDate !== editedTrip.startDate) {
    overrides.startDate = editedTrip.startDate;
  }

  if (trip.endDate !== editedTrip.endDate) {
    overrides.endDate = editedTrip.endDate;
  }

  if (trip.fullDays !== editedTrip.fullDays) {
    overrides.fullDays = editedTrip.fullDays;
  }

  if (trip.rating !== editedTrip.rating) {
    overrides.rating = editedTrip.rating;
  }

  if (trip.favorite !== editedTrip.favorite) {
    overrides.favorite = editedTrip.favorite;
  }

  return overrides;
}
