/**
 * @file Utils for sorting countries.
 */

import type { Trip } from "@features/trips";
import {
  getFirstVisitDateByCountry,
  getLastVisitDateByCountry,
} from "@features/visits/utils/visits";
import { sortItems } from "@utils/sort";
import { normalizeString } from "@utils/string";
import type { Country, CountrySortBy } from "../types";

/** Builds lookup maps for first and last visit dates by country.
 * @param trips - Array of Trip objects.
 * @returns An object containing firstVisitMap and lastVisitMap.
 */
function buildVisitDateMaps(trips: Trip[]) {
  return {
    firstVisitMap: getFirstVisitDateByCountry(trips),
    lastVisitMap: getLastVisitDateByCountry(trips),
  };
}

/**
 * Sorts countries based on the specified key and direction (e.g. "name-asc").
 * @param countries - The list of countries to sort.
 * @param sortBy - The key and direction to sort by (e.g. "name-asc").
 * @param trips - The list of trips for visit-based sorts.
 * @returns The sorted list of countries.
 */
export function sortCountries(
  countries: Country[],
  sortBy: CountrySortBy,
  trips: Trip[]
) {
  const { firstVisitMap, lastVisitMap } = buildVisitDateMaps(trips);
  const [key, direction] = sortBy.split("-");
  const asc = direction !== "desc";

  switch (key) {
    case "name":
      return sortItems(
        countries,
        (c) => normalizeString(c.name),
        asc ? "asc" : "desc"
      );
    case "iso":
      return sortItems(countries, (c) => c.isoCode || "", asc ? "asc" : "desc");
    case "firstVisit":
      return sortItems(
        countries,
        (c) => firstVisitMap[c.isoCode]?.getTime() ?? 0,
        asc ? "asc" : "desc"
      );
    case "lastVisit":
      return sortItems(
        countries,
        (c) => lastVisitMap[c.isoCode]?.getTime() ?? 0,
        asc ? "asc" : "desc"
      );
    default:
      return countries;
  }
}

/**
 * Generates sort options for countries.
 * @param visitedOnly - Whether to include visit-based sort options.
 * @returns An array of sort option objects.
 */
export const getSortOptions = (visitedOnly?: boolean) => [
  { value: "name-asc", label: "Name (ascending)" },
  { value: "name-desc", label: "Name (descending)" },
  { value: "iso-asc", label: "ISO 3166 code (ascending)" },
  { value: "iso-desc", label: "ISO 3166 code (descending)" },
  ...(visitedOnly
    ? [
        { value: "firstVisit-asc", label: "First visit time (ascending)" },
        { value: "firstVisit-desc", label: "First visit time (descending)" },
        { value: "lastVisit-asc", label: "Last visit time (ascending)" },
        { value: "lastVisit-desc", label: "Last visit time (descending)" },
      ]
    : []),
];
