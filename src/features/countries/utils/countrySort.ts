/**
 * Utils for sorting countries.
 */

import {
  getFirstVisitDateByCountry,
  getLastVisitDateByCountry,
} from "@features/visits/utils/visits";
import type { Country, Trip } from "@types";
import { sortItems } from "@utils/sort";
import { normalizeString } from "@utils/string";
import type { CountrySortBy } from "../types/countrySortBy";

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
 * Sorts countries based on the specified criteria.
 * @param countries - The list of countries to sort.
 * @param sortBy - The criteria to sort the countries by.
 * @returns The sorted list of countries.
 */
export function sortCountries(
  countries: Country[],
  sortBy: CountrySortBy,
  trips: Trip[]
) {
  const { firstVisitMap, lastVisitMap } = buildVisitDateMaps(trips);

  switch (sortBy) {
    case "name-asc":
      return sortItems(countries, (c) => normalizeString(c.name), "asc");
    case "name-desc":
      return sortItems(countries, (c) => normalizeString(c.name), "desc");
    case "iso-asc":
      return sortItems(countries, (c) => c.isoCode || "", "asc");
    case "iso-desc":
      return sortItems(countries, (c) => c.isoCode || "", "desc");
    // Visit options
    case "first-visit-asc":
      return sortItems(
        countries,
        (c) => firstVisitMap[c.isoCode]?.getTime() ?? 0,
        "asc"
      );
    case "first-visit-desc":
      return sortItems(
        countries,
        (c) => firstVisitMap[c.isoCode]?.getTime() ?? 0,
        "desc"
      );
    case "last-visit-asc":
      return sortItems(
        countries,
        (c) => lastVisitMap[c.isoCode]?.getTime() ?? 0,
        "asc"
      );
    case "last-visit-desc":
      return sortItems(
        countries,
        (c) => lastVisitMap[c.isoCode]?.getTime() ?? 0,
        "desc"
      );
    default:
      return countries;
  }
}
