/**
 * Utility functions for sorting items.
 */

/**
 * Generic function to sort items based on a provided value extractor and direction.
 * @param items - The array of items to sort.
 * @param getSortValue - A function that extracts the value to sort by from each item.
 * @param direction - The direction of the sort, either "asc" for ascending or "desc" for descending. Defaults to "asc".
 * @returns A new array of items sorted based on the extracted values and specified direction.
 */
export function sortItems<T>(
  items: T[],
  getSortValue: (item: T) => any,
  direction: "asc" | "desc" = "asc"
): T[] {
  return [...items].sort((a, b) => {
    const aValue = getSortValue(a);
    const bValue = getSortValue(b);
    if (aValue === bValue) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;
    if (direction === "asc") return aValue > bValue ? 1 : -1;
    return aValue < bValue ? 1 : -1;
  });
}
