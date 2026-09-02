/**
 * Utility functions for the Discover feature.
 */

import type { Country, CountryFact } from "@features/countries/types";

const MILLISECONDS_PER_DAY = 86_400_000;

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

  const dayIndex = Math.floor(startOfDay / MILLISECONDS_PER_DAY);

  return countries[dayIndex % countries.length];
}

/**
 * Gets deterministic facts for the current day.
 * @param facts - Array of country facts.
 * @param count - Number of facts to return.
 * @param date - Date used to determine the day.
 * @returns The daily facts, or an empty array when the list is empty.
 */
export function getDailyFacts(
  facts: CountryFact[],
  count = 5,
  date = new Date(),
): CountryFact[] {
  if (facts.length === 0 || count <= 0) return [];

  const startOfDay = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  );

  const dayIndex = Math.floor(startOfDay / MILLISECONDS_PER_DAY);

  const startIndex = dayIndex % facts.length;
  const orderedFacts = [
    ...facts.slice(startIndex),
    ...facts.slice(0, startIndex),
  ];

  const selectedFacts: CountryFact[] = [];
  const usedCountryCodes = new Set<string>();

  for (const fact of orderedFacts) {
    const hasSharedCountry = fact.countryCodes.some((code) =>
      usedCountryCodes.has(code),
    );

    if (hasSharedCountry) continue;

    selectedFacts.push(fact);

    for (const code of fact.countryCodes) {
      usedCountryCodes.add(code);
    }

    if (selectedFacts.length === count) break;
  }

  return selectedFacts;
}
