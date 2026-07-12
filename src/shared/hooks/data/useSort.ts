import { useState, useMemo } from "react";

/**
 * Handles sorting of items.
 * @param items - Items to sort
 * @param sorter - Sorting function
 * @param initialSort - Initial sort key
 * @returns Current sort state and sorted items
 */
export function useSort<T, K extends string>(
  items: T[],
  sorter: (items: T[], sortBy: K) => T[],
  initialSort: K
) {
  // Current sort state
  const [sortBy, setSortBy] = useState<K>(initialSort);

  // Memoized sorted items
  const sortedItems = useMemo(
    () => sorter(items, sortBy),
    [items, sortBy, sorter]
  );

  return { sortBy, setSortBy, sortedItems };
}
