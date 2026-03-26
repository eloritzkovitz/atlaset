/**
 * @file Utils for sorting countries.
 */

// Direction options moved to SortSelect.tsx
import type { Trip } from "@features/trips";
import {
  getFirstVisitDateByCountry,
  getLastVisitDateByCountry,
  getVisitedCountriesUpToYear,
} from "@features/visits/utils/visits";
import { sortItems } from "@utils/sort";
import { normalizeString } from "@utils/string";
import type { Country } from "../types";

/** Sort keys for countries. */
export type CountrySortByKey =
  | "name"
  | "isoCode"
  | "visitCount"
  | "firstVisit"
  | "lastVisit";

/** Sort options for countries. */
export type CountrySortBy =
  | `${CountrySortByKey}-asc`
  | `${CountrySortByKey}-desc`;

/** Dropdown option for sort, with optional icon */
export type CountrySortOption = {
  value: CountrySortBy;
  label: string;
  icon?: React.ComponentType<{ size?: number }>;
};

/** Builds lookup maps for first and last visit dates by country.
 * @param trips - Array of Trip objects.
 * @returns An object containing firstVisitMap and lastVisitMap.
 */
function buildVisitDateMaps(trips: Trip[]) {
  return {
    visitCountMap: getVisitedCountriesUpToYear(trips, new Date().getFullYear()),
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
  trips: Trip[],
) {
  const { firstVisitMap, lastVisitMap, visitCountMap } =
    buildVisitDateMaps(trips);
  const [key, direction] = sortBy.split("-");
  const asc = direction !== "desc";

  switch (key) {
    case "name":
      return sortItems(
        countries,
        (c) => normalizeString(c.name),
        asc ? "asc" : "desc",
      );
    case "isoCode":
      return sortItems(countries, (c) => c.isoCode || "", asc ? "asc" : "desc");
    case "visitCount":
      return sortItems(
        countries,
        (c) => visitCountMap[c.isoCode] ?? 0,
        asc ? "asc" : "desc",
      );
    case "firstVisit":
      return sortItems(
        countries,
        (c) => firstVisitMap[c.isoCode]?.getTime() ?? 0,
        asc ? "asc" : "desc",
      );
    case "lastVisit":
      return sortItems(
        countries,
        (c) => lastVisitMap[c.isoCode]?.getTime() ?? 0,
        asc ? "asc" : "desc",
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
export function getCountrySortOptions(visitedOnly: boolean): Array<{
  label: string;
  options: Array<{
    value: string;
    label: string;
    icon?: React.ComponentType<{ size?: number }>;
  }>;
}> {
  // Declarative config for all possible sort keys
  const allKeyOptions = [
    { value: "name", label: "Name" },
    { value: "isoCode", label: "ISO 3166-1 code" },
    { value: "visitCount", label: "Visit count" },
    { value: "firstVisit", label: "First visit time" },
    { value: "lastVisit", label: "Last visit time" },
  ];

  // Only include timeline options if visitedOnly
  const keyOptions = visitedOnly
    ? allKeyOptions
    : allKeyOptions.filter(
        (opt) => opt.value === "name" || opt.value === "isoCode",
      );

  return [{ label: "SORT BY", options: keyOptions }];
}
