/**
 * @file Utility functions for dropdowns.
 */

import type { DropdownOption, Option } from "@types";
import { capitalizeWords } from "@utils/string";

/**
 * Type guard to check if a dropdown option is a plain option with a value in the allowed list.
 * @param opt - The dropdown option or group to check.
 * @param allowed - Array of allowed values.
 * @returns True if the option is a plain option with a value in allowed, false otherwise.
 */
export function isAllowedOption<
  T extends { value?: unknown },
  V extends string | number
>(
  opt: T | { options: unknown },
  allowed: readonly V[] | ((value: unknown) => boolean)
): opt is T & { value: V } {
  return (
    "value" in opt &&
    (typeof allowed === "function"
      ? allowed(opt.value)
      : allowed.includes(opt.value as V))
  );
}

/**
 * Type guard to check if a dropdown option has a string value.
 * @param opt - The dropdown option to check.
 * @returns True if the option's value is a string, false otherwise.
 */
export function isStringOption<T extends { value: unknown }>(
  opt: T
): opt is T & { value: string } {
  return isAllowedOption(opt, (v) => typeof v === "string");
}

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
