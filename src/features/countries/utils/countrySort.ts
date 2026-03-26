/**
 * Utililty functions for sorting countries.
 */

import type { VisitContext } from "@features/visits";
import { sortItems } from "@utils/sort";
import { normalizeString } from "@utils/string";
import { ALL_SORT_KEY_OPTIONS } from "../constants/propertyConfig";
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
  visitContext: VisitContext,
) {
  const [key, direction] = sortBy.split("-");
  const asc = direction !== "desc";
  const dir = asc ? "asc" : "desc";

  switch (key) {
    case "name":
      return sortItems(countries, (c) => normalizeString(c.name), dir);
    case "isoCode":
      return sortItems(countries, (c) => c.isoCode || "", dir);
    case "visitCount":
      return sortItems(
        countries,
        (c) => visitContext.visitedMap[c.isoCode] ?? 0,
        dir,
      );
    case "firstVisit":
      return sortItems(
        countries,
        (c) => visitContext.firstVisitMap?.[c.isoCode]?.getTime() ?? 0,
        dir,
      );
    case "lastVisit":
      return sortItems(
        countries,
        (c) => visitContext.lastVisitMap?.[c.isoCode]?.getTime() ?? 0,
        dir,
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
  const keyOptions = visitedOnly
    ? ALL_SORT_KEY_OPTIONS
    : ALL_SORT_KEY_OPTIONS.filter(
        (opt) => opt.value === "name" || opt.value === "isoCode",
      );

  return [{ label: "SORT BY", options: keyOptions }];
}
