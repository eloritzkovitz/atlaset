/**
 * @file Utility functions for dropdowns.
 */

import { capitalizeWords } from "@utils/string";

/**
 * Converts an array of items into dropdown options.
 * @param items - Array of items (strings or objects).
 * @param valueFn - Function to extract the value from each item.
 * @param labelFn - Function to generate the label from each item.
 * @returns Array of dropdown options.
 */
export function toDropdownOptions<T, V extends string = string>(
  items: T[],
  valueFn: (item: T) => V,
  labelFn: (item: T) => string = (item) =>
    capitalizeWords(String(valueFn(item)).replace(/-/g, " "))
): { value: V; label: string }[] {
  return items.map((item) => ({
    value: valueFn(item),
    label: labelFn(item),
  }));
}
