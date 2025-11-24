/**
 * @file Utility functions for array operations.
 */

import type { Option } from "@types";
import { capitalizeWords } from "./string";

/**
 * Extracts unique values from a list of items using the provided extractor function.
 * @param items - The array of items to extract from.
 * @param extractor - A function that extracts a value or array of values from an item.
 * @param allValues - An iterable of all possible values.
 * @returns An array of unique extracted values.
 */
export function extractUniqueValues<T, V>(
  items: T[] | null | undefined,
  extractor: (item: T) => V[] | V | undefined,
  allValues: Iterable<V>
): V[] {
  if (!items || items.length === 0) return Array.from(allValues);
  const set = new Set<V>();
  items.forEach((item) => {
    const value = extractor(item);
    if (Array.isArray(value)) value.forEach((v) => set.add(v));
    else if (value !== undefined) set.add(value);
  });
  return Array.from(set);
}

/**
 * Extracts unique string values from a list of items, sorts them, and returns the sorted array.
 * @param items - The array of items to extract from.
 * @param valueFn - A function that extracts a string value from an item.
 * @returns A sorted array of unique string values.
 */
export function extractUniqueSorted<T, V extends string>(
  items: T[],
  valueFn: (item: T) => V | undefined
): V[] {
  return Array.from(
    new Set(items.map(valueFn).filter((v): v is V => !!v))
  ).sort((a, b) => a.localeCompare(b));
}

/**
 * Maps an array of strings to Option objects.
 * @param options Array of string options
 * @param labelFn Function to format the label (defaults to capitalizeWords)
 * @returns Array of Option objects with string labels
 */
export function mapOptions<T extends string = string>(
  options: T[],
  labelFn: (value: T) => string = capitalizeWords
): Option<T, string>[] {
  return options.map((r) => ({ value: r, label: labelFn(r) }));
}
