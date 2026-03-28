/**
 * Utility functions for working with objects, providing type-safe operations while maintaining type information.
 */

/**
 * Gets the keys of an object as an array of strings, while preserving type information.
 * @param obj - The object to get the keys from.
 * @returns An array of keys from the object, typed as an array of the object's key names.
 */
export function keysOf<T extends Record<string, unknown>>(
  obj: T,
): Array<keyof T & string> {
  return Object.keys(obj) as Array<keyof T & string>;
}
