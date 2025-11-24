/**
 * @file Utility functions for filter configurations and operations.
 */

import type { FilterConfig, FilterOption } from "@types";
import { normalizeString } from "./string";

/**
 * Creates a select filter configuration object.
 * @param key - The unique key for the filter.
 * @param label - The label for the filter, can be a string or a function returning a string.
 * @param getOptions - Function to retrieve the filter options.
 * @param getValue - Function to get the current value of the filter.
 * @param setValue - Function to set the value of the filter.
 * @returns A FilterConfig object for the select filter.
 */
export function createSelectFilter<
  T = string,
  P = any,
  K extends string = string
>(
  key: K,
  label: string | ((param: P) => string),
  getOptions: (options?: T[]) => FilterOption[],
  getValue: (props: any, param?: P) => string,
  setValue: (props: any, val: string, param?: P) => void
): FilterConfig<T, P, K> {
  return {
    key,
    label,
    type: "select",
    getOptions,
    getValue,
    setValue,
  };
}

/**
 * Filters items based on a search string and a field extractor function.
 * @param items - The array of strings to map.
 * @param search - The search string to filter by.
 * @param getField - A function to get the field to search within each item.
 * @returns The filtered array of items.
 */
export function filterBySearch<T>(
  items: T[],
  search: string,
  getField: (item: T) => string
) {
  if (!search) return items;
  const normalizedSearch = normalizeString(search);
  return items.filter((item) =>
    normalizeString(getField(item)).includes(normalizedSearch)
  );
}
