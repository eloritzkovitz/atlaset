/**
 * Utility functions for quiz components.
 */

import type { Country } from "@features/countries";
import type { Difficulty, GameMode } from "../../types";

/**
 * Filters countries by difficulty.
 * @param countries - Array of countries to filter
 * @param difficulty - Difficulty level to filter by
 * @param countryDifficulty - Record mapping country ISO codes to difficulty levels
 * @returns Filtered array of countries
 */
export function filterByDifficulty(
  countries: Country[],
  difficulty?: Difficulty,
  countryDifficulty?: Record<string, string>
) {
  // If no difficulty or countryDifficulty provided, return all countries
  if (!difficulty || !countryDifficulty) return countries;
  return countries.filter((c) => countryDifficulty[c.isoCode] === difficulty);
}

/**
 * Filters countries that have a specific property defined and non-empty.
 * @param countries - Array of countries to filter
 * @param property - Property name to check
 * @returns Filtered array of countries
 */
export function filterByProperty<T extends keyof Country>(
  countries: Country[],
  property: T
) {
  return countries.filter(
    (c) => Boolean(c[property]) && String(c[property]).trim() !== ""
  );
}

/**
 * Returns a function to get the next random country, ensuring it's not the same as the previous one.
 * @param countries - Array of countries to choose from
 * @returns Function that takes the previous country and returns the next country
 */
export function getNextRandomCountry<T extends { isoCode: string }>(
  countries: T[]
) {
  return (prevCountry: T | null) => {
    if (countries.length <= 1 || !prevCountry) {
      return countries[Math.floor(Math.random() * countries.length)] || null;
    }
    let next;
    do {
      next = countries[Math.floor(Math.random() * countries.length)];
    } while (next && prevCountry && next.isoCode === prevCountry.isoCode);
    return next;
  };
}

/**
 * Returns a getNext function for useQuiz, given a getNextCountry function and a countries list.
 * Handles undefined return values as null.
 */
export function makeGetNext<T>(
  getNextCountry: (countries: T[]) => (prev: T | null) => T | null,
  countries: T[]
): (prev: T | null) => T | null {
  const getNext = getNextCountry(countries);
  return (prev: T | null) => {
    const result = getNext(prev);
    return result === undefined ? null : result;
  };
}

/**
 * Generates session properties based on game mode.
 * @param gameMode - The game mode ("sandbox" or "timed")
 * @param maxQuestions - Maximum number of questions
 * @param duration - Duration of the timed session in seconds
 * @returns Session properties object
 */
export function getSessionProps(
  gameMode?: GameMode,
  maxQuestions = 25,
  duration = 300
) {
  return gameMode === "timed" ? { maxQuestions, duration } : { maxQuestions };
}
