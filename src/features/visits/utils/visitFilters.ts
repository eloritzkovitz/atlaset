import type { Country } from "@features/countries";
import type { VisitedStatus } from "../types";

/**
 * Filters countries to only those that have been visited.
 * @param countries - The list of countries to filter.
 * @param visitedIsoCodes - The list of visited country ISO codes.
 * @returns Filtered list of countries that have been visited.
 */
export function filterByVisited(
  countries: Country[],
  visitedIsoCodes: string[],
) {
  return countries.filter((c) => visitedIsoCodes.includes(c.isoCode));
}

/**
 * Filters countries by visited status.
 * @param countries - The list of countries to filter.
 * @param visitedIsoCodes - The list of visited country ISO codes.
 * @param status - The visited status to filter by.
 * @returns Filtered list of countries by visited status.
 */
export function filterByVisitStatus(
  countries: Country[],
  visitedIsoCodes: string[],
  status: VisitedStatus,
) {
  if (status === "visited") {
    return countries.filter((c) => visitedIsoCodes.includes(c.isoCode));
  } else if (status === "not_visited") {
    return countries.filter((c) => !visitedIsoCodes.includes(c.isoCode));
  }
  return countries;
}

/**
 * Filters countries based on visit count criteria.
 * @param countries - The list of countries to filter.
 * @param visitedMap - A map of country ISO codes to their visit counts.
 * @param min - Minimum visit count.
 * @param max - Maximum visit count (optional).
 * @returns Filtered list of countries based on visit count criteria.
 */
export function filterByVisitCount(
  countries: Country[],
  visitedMap: Record<string, number>,
  min: number,
  max?: number,
) {
  return countries.filter((c) => {
    const count = visitedMap[c.isoCode] || 0;
    return count >= min && (typeof max !== "number" || count <= max);
  });
}
