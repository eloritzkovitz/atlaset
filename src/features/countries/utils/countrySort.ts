/**
 * Utililty functions for sorting countries.
 */

import type { TFunction } from "i18next";
import type { VisitContext } from "@features/visits/types";
import type { SortDirection, SortValue } from "@types";
import { normalizeString, sortItems } from "@utils";
import type { Country } from "../types";

/** Sort keys for countries. */
export type CountrySortByKey =
  | "name"
  | "isoCode"
  | "area"
  | "population"
  | "visitCount"
  | "firstVisit"
  | "lastVisit";

/** Sort options for countries. */
export type CountrySortBy = SortValue<CountrySortByKey>;

/** Dropdown option for sort, with optional icon */
export type CountrySortOption = {
  value: CountrySortByKey;
  label: string;
  icon?: React.ComponentType<{ size?: number }>;
  mode: "default" | "visited";
};

export const ALL_SORT_KEY_OPTIONS: CountrySortOption[] = [
  { value: "name", label: "Name", mode: "default" },
  { value: "isoCode", label: "ISO 3166-1 code", mode: "default" },
  { value: "area", label: "Area", mode: "default" },
  { value: "population", label: "Population", mode: "default" },
  { value: "visitCount", label: "Visit count", mode: "visited" },
  { value: "firstVisit", label: "First visit time", mode: "visited" },
  { value: "lastVisit", label: "Last visit time", mode: "visited" },
];

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
  const [key, direction] = sortBy.split("-") as [
    CountrySortByKey,
    SortDirection,
  ];

  // Define accessors for each sort key, including visit-based keys that use the visitContext
  const accessors: Record<CountrySortByKey, (c: Country) => string | number> = {
    name: (c) => normalizeString(c.name),
    isoCode: (c) => c.isoCode || "",
    area: (c) => c.area ?? 0,
    population: (c) => c.population ?? 0,
    visitCount: (c) => visitContext.visitedMap[c.isoCode] ?? 0,
    firstVisit: (c) => visitContext.firstVisitMap?.[c.isoCode]?.getTime() ?? 0,
    lastVisit: (c) => visitContext.lastVisitMap?.[c.isoCode]?.getTime() ?? 0,
  };

  const accessor = accessors[key];
  return accessor ? sortItems(countries, accessor, direction) : countries;
}

/**
 * Generates sort options for countries.
 * @param visitedOnly - Whether to include visit-based sort options.
 * @param t - Optional translation function for labels.
 * @returns An array of sort option objects.
 */
export function getCountrySortOptions(
  visitedOnly: boolean,
  t?: TFunction,
): Array<{
  options: Array<{
    value: string;
    label: string;
    icon?: React.ComponentType<{ size?: number }>;
  }>;
}> {
  const keyOptions = visitedOnly
    ? ALL_SORT_KEY_OPTIONS
    : ALL_SORT_KEY_OPTIONS.filter((opt) => opt.mode === "default");

  return [
    {
      options: keyOptions.map((o) => ({
        value: o.value,
        label: t ? t(`atlas:countries.sort.${o.value}`, o.label) : o.label,
        icon: o.icon,
      })),
    },
  ];
}
