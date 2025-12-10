/**
 * Utilities for filtering trips.
 */

import type { TripFilters } from "@features/trips/types";
import type { Trip } from "@types";

/**
 * Filters trips based on the provided filters.
 * @param trips - An array of trips to filter.
 * @param filters - The filters to apply.
 * @returns - The filtered array of trips.
 */
export function filterTrips(trips: Trip[], filters: TripFilters): Trip[] {
  return trips.filter((trip) => {
    // Filter by name (case-insensitive substring match)
    if (
      filters.name &&
      !trip.name.toLowerCase().includes(filters.name.toLowerCase())
    ) {
      return false;
    }
    // Filter by rating
    if (
      typeof filters.rating === "number" &&
      filters.rating !== -1 &&
      (trip.rating === undefined || trip.rating !== filters.rating)
    ) {
      return false;
    }
    // Filter by country codes
    if (
      Array.isArray(filters.country) &&
      filters.country.length > 0 &&
      !filters.country.some((code) => trip.countryCodes.includes(code))
    ) {
      return false;
    }
    // Filter by years
    if (
      filters.year.length > 0 &&
      (!trip.startDate ||
        !filters.year.includes(
          new Date(trip.startDate).getFullYear().toString()
        ))
    ) {
      return false;
    }
    // Filter by categories
    if (
      filters.categories &&
      filters.categories.length > 0 &&
      (!trip.categories ||
        !filters.categories.every((cat) => trip.categories?.includes(cat)))
    ) {
      return false;
    }
    // Filter by status
    if (filters.status && trip.status !== filters.status) {
      return false;
    }
    // Filter by tags
    if (
      filters.tags &&
      filters.tags.length > 0 &&
      (!trip.tags || !filters.tags.every((tag) => trip.tags?.includes(tag)))
    ) {
      return false;
    }
    return true;
  });
}
