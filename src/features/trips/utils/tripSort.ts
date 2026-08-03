/**
 * Utility functions for sorting trips.
 */

import type { Country } from "@features/countries";
import { createCountryMap } from "@features/countries/utils/countryData";
import { sortItems } from "@utils";
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

  // Separate tentative (no startDate) and non-tentative trips
  const tentative = trips.filter((t) => !t.startDate);
  const nonTentative = trips.filter((t) => t.startDate);

  let sortedNonTentative: Trip[];
  switch (key) {
    case "name":
      sortedNonTentative = sortItems(
        nonTentative,
        (t) => t.name || "",
        asc ? "asc" : "desc"
      );
      break;
    case "rating":
      sortedNonTentative = sortItems(
        nonTentative,
        (t) => t.rating || 0,
        asc ? "asc" : "desc"
      );
      break;
    case "countries":
      sortedNonTentative = sortItems(
        nonTentative,
        (t) =>
          t.countryCodes
            .map((code) => countryNameMap[code.toLowerCase()] || "")
            .filter(Boolean)
            .join(", "),
        asc ? "asc" : "desc"
      );
      break;
    case "year":
      sortedNonTentative = sortItems(
        nonTentative,
        (t) => (t.startDate ? new Date(t.startDate).getFullYear() : 0),
        asc ? "asc" : "desc"
      );
      break;
    case "startDate":
      sortedNonTentative = [...nonTentative].sort((a, b) => {
        return asc
          ? a.startDate!.localeCompare(b.startDate!)
          : b.startDate!.localeCompare(a.startDate!);
      });
      break;
    case "endDate":
      sortedNonTentative = [...nonTentative].sort((a, b) => {
        if (a.endDate && b.endDate) {
          return asc
            ? a.endDate.localeCompare(b.endDate)
            : b.endDate.localeCompare(a.endDate);
        }
        if (!a.endDate && b.endDate) return 1;
        if (a.endDate && !b.endDate) return -1;
        return 0;
      });
      break;
    case "fullDays":
      sortedNonTentative = sortItems(
        nonTentative,
        (t) => t.fullDays || 0,
        asc ? "asc" : "desc"
      );
      break;
    case "categories":
      sortedNonTentative = sortItems(
        nonTentative,
        (t) => (t.categories ? t.categories.join(",") : ""),
        asc ? "asc" : "desc"
      );
      break;
    case "status":
      sortedNonTentative = sortItems(
        nonTentative,
        (t) => t.status || "",
        asc ? "asc" : "desc"
      );
      break;
    case "tags":
      sortedNonTentative = sortItems(
        nonTentative,
        (t) => (t.tags ? t.tags.join(",") : ""),
        asc ? "asc" : "desc"
      );
      break;
    default:
      sortedNonTentative = nonTentative;
  }

  // Always put tentative trips first
  return [...tentative, ...sortedNonTentative];
}
