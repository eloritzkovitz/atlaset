/**
 * @file Utility functions for dropdowns.
 */

import type { DropdownOption, Option } from "@types";
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
): Option<V, string>[] {
  return items.map((item) => ({
    value: valueFn(item),
    label: labelFn(item),
  }));
}

/**
 * Flattens an array of dropdown options, expanding any option groups.
 * @param options - Array of dropdown options or option groups.
 * @returns Flattened array of dropdown options.
 */
export function flattenOptions<T>(options: DropdownOption<T>[]): Option<T>[] {
  return options.flatMap((opt) => ("options" in opt ? opt.options : [opt]));
}
