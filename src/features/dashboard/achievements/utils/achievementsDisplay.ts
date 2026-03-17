import { createSovereigntyFilter, type Country } from "@features/countries";
import { getAchievementCountries } from "./achievements";
import type { Achievement, Criteria } from "../types";

/**
 * Formats the progress chip label for an achievement
 * @param label - The progress label string
 * @returns Formatted progress chip label
 */
export function formatProgressChip(label: string): string {
  if (/^\d+\/\d+$/.test(label)) return `Progress: ${label}`;
  if (/^\d+$/.test(label)) return label;
  return "";
}

/**
 * Gets the countries to display flags for an achievement
 * @param achievement - The achievement object
 * @param displayCriteria - Criteria to use for display
 * @param countries - List of all countries
 * @param tierCount - Optional tier count to limit countries
 * @returns Array of countries to display flags for
 */
export function getDisplayFlagCountries(
  achievement: Achievement,
  displayCriteria: Criteria,
  countries: Country[],
  tierCount?: number,
) {
  // Helper to check for trip-based criteria
  const isTripBased = [
    "trip_countries_count",
    "local_trips_count",
    "abroad_countries_count",
    "abroad_trips_count",
    "repeat_visits_count",
    "trip_duration_days",
  ].some((key) => (displayCriteria as Record<string, unknown>)[key]);
  if (isTripBased) return [];

  // Countries explicitly defined
  const displayCountries = displayCriteria.countries;
  const hasDisplayCountries =
    Array.isArray(displayCountries) && displayCountries.length > 0;
  if (
    (achievement.countries && achievement.countries.length > 0) ||
    hasDisplayCountries
  ) {
    let achCountries = getAchievementCountries(
      { ...achievement, criteria: displayCriteria },
      countries,
    );
    if (typeof tierCount === "number" && achievement.countries) {
      achCountries = achCountries.slice(0, tierCount);
    }
    return achCountries;
  }

  // Country filters based on criteria
  const filterMap: { [key: string]: (c: Country) => boolean } = {
    region: (c) => c.region === displayCriteria.region!,
    subregion: (c) => c.subregion === displayCriteria.subregion!,
    currency: (c) => c.currency === displayCriteria.currency!,
    language: (c) => c.languages?.includes(displayCriteria.language!) ?? false,
  };

  const sovereigntyFilter = createSovereigntyFilter(true);
  for (const key of Object.keys(filterMap)) {
    if (displayCriteria[key as keyof typeof displayCriteria]) {
      return countries.filter((c) => filterMap[key](c) && sovereigntyFilter(c));
    }
  }
  return [];
}
