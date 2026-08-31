/**
 * Utility functions for the Discover feature.
 */

import type { Country } from "@features/countries/types";

/**
 * Gets a deterministic country for the current day.
 * @param countries - Array of country objects.
 * @param date - Date used to determine the day.
 * @returns The country of the day, or undefined when the list is empty.
 */
export function getDailyCountry(
  countries: Country[],
  date = new Date(),
): Country | undefined {
  if (countries.length === 0) return undefined;

  const startOfDay = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  );

  const dayIndex = Math.floor(startOfDay / 86_400_000);

  return countries[dayIndex % countries.length];
}
