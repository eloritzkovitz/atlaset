/**
 * @file Utility functions for array operations.
 */

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