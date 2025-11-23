/**
 * Utilities for sorting trips.
 */

import { getCountryNames } from "@features/trips/utils/tripData";
import type { TripSortBy } from "@features/trips/types";
import type { Trip } from "@types";
import { sortItems } from "@utils/sort";

/**
 * Sorts trips based on a given key and order encoded in sortBy (e.g. "name-asc").
 * @param trips - An array of trips to sort.
 * @param countries - An array of country objects with isoCode and name.
 * @param sortBy - The key and direction to sort by (e.g. "name-asc").
 * @returns - The sorted array of trips.
 */
export function sortTrips(
  trips: Trip[],
  countries: { isoCode: string; name: string }[],
  sortBy: TripSortBy
): Trip[] {
  const [key, direction] = sortBy.split("-");
  const asc = direction !== "desc";

  switch (key) {
    case "name":
      return sortItems(trips, (t) => t.name || "", asc ? "asc" : "desc");
    case "countries":
      return sortItems(
        trips,
        (t) => getCountryNames(t, countries),
        asc ? "asc" : "desc"
      );
    case "year":
      return sortItems(
        trips,
        (t) => (t.startDate ? new Date(t.startDate).getFullYear() : 0),
        asc ? "asc" : "desc"
      );
    case "startDate":
      return sortItems(trips, (t) => t.startDate || "", asc ? "asc" : "desc");
    case "endDate":
      return sortItems(trips, (t) => t.endDate || "", asc ? "asc" : "desc");
    case "fullDays":
      return sortItems(trips, (t) => t.fullDays || 0, asc ? "asc" : "desc");
    case "categories":
      return sortItems(
        trips,
        (t) => (t.categories ? t.categories.join(",") : ""),
        asc ? "asc" : "desc"
      );
    case "status":
      return sortItems(trips, (t) => t.status || "", asc ? "asc" : "desc");
    case "tags":
      return sortItems(
        trips,
        (t) => (t.tags ? t.tags.join(",") : ""),
        asc ? "asc" : "desc"
      );
    default:
      return trips;
  }
}
