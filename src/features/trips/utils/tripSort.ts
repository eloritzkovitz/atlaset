/**
 * @file Utilities for sorting trips.
 */

import type { Country } from "@features/countries";
import { createCountryMap } from "@features/countries/utils/countryData";
import { sortItems } from "@utils/sort";
import type { Trip, TripSortBy } from "../types";

/**
 * Sorts trips based on a given key and order encoded in sortBy (e.g. "name-asc").
 * @param trips - An array of trips to sort.
 * @param countries - An array of country objects.
 * @param sortBy - The key and direction to sort by (e.g. "name-asc").
 * @returns - The sorted array of trips.
 */
export function sortTrips(
  trips: Trip[],
  countries: Country[],
  sortBy: TripSortBy
): Trip[] {
  const [key, direction] = sortBy.split("-");
  const asc = direction !== "desc";

  // Create a lookup map for country names by their ISO codes
  const countryNameMap = createCountryMap(countries, (c) => c.name);

  switch (key) {
    case "name":
      return sortItems(trips, (t) => t.name || "", asc ? "asc" : "desc");
    case "rating":
      return sortItems(trips, (t) => t.rating || 0, asc ? "asc" : "desc");
    case "countries":
      return sortItems(
        trips,
        (t) =>
          t.countryCodes
            .map((code) => countryNameMap[code.toLowerCase()] || "")
            .filter(Boolean)
            .join(", "),
        asc ? "asc" : "desc"
      );
    case "year":
      return sortItems(
        trips,
        (t) => (t.startDate ? new Date(t.startDate).getFullYear() : 0),
        asc ? "asc" : "desc"
      );
    case "startDate":
      return [...trips].sort((a, b) => {
        if (a.startDate && b.startDate) {
          return asc
            ? a.startDate.localeCompare(b.startDate)
            : b.startDate.localeCompare(a.startDate);
        }
        if (!a.startDate && b.startDate) return 1; // a is tentative, goes last
        if (a.startDate && !b.startDate) return -1; // b is tentative, goes last
        return 0; // both tentative
      });
    case "endDate":
      return [...trips].sort((a, b) => {
        if (a.endDate && b.endDate) {
          return asc
            ? a.endDate.localeCompare(b.endDate)
            : b.endDate.localeCompare(a.endDate);
        }
        if (!a.endDate && b.endDate) return 1;
        if (a.endDate && !b.endDate) return -1;
        return 0;
      });
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
