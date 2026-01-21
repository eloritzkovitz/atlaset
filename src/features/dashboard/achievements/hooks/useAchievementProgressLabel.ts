import { useMemo } from "react";
import type { Country } from "@features/countries";
import type { Trip } from "@features/trips";
import { getProgress } from "../utils/achievements";
import type { Achievement } from "../../types";

/**
 * Generates a progress label for an achievement based on its criteria and user's progress.
 * @param achievement - The achievement object
 * @param countries - List of all countries
 * @param visited - Object with method to check if a country is visited
 * @param trips - Optional list of user's trips
 * @param homeCountry - Optional home country ISO code
 * @param status - Optional achievement status
 * @returns Progress label string
 */
export function useAchievementProgressLabel(
  achievement: Achievement,
  countries: Country[],
  visited: { isCountryVisited: (iso: string) => boolean },
  trips?: Trip[],
  homeCountry?: string,
  status?: string,
) {
  return useMemo(() => {
    const criteria = achievement.criteria || {};
    // Region-based (multiple regions)
    if (criteria.regions && Array.isArray(criteria.regions)) {
      const completedCount = criteria.regions.filter((region: string) => {
        const countriesInRegion = countries.filter((c) => c.region === region);
        return countriesInRegion.some((c) =>
          visited.isCountryVisited(c.isoCode),
        );
      }).length;
      const minRequired = criteria.min_regions || criteria.regions.length;
      return `${completedCount}/${minRequired}`;
    }
    // Trip-based: trip_countries_count (optionally with region)
    if (criteria.trip_countries_count && criteria.region) {
      return status === "completed"
        ? "Trip completed"
        : "No qualifying trip yet";
    }
    // Trip-based: trip_countries_count (any region)
    if (criteria.trip_countries_count && !criteria.region) {
      return status === "completed"
        ? "Trip completed"
        : "No qualifying trip yet";
    }
    // Trip duration
    if (criteria.trip_duration_days) {
      return status === "completed"
        ? "Trip completed"
        : "No qualifying trip yet";
    }
    // Local trips
    if (criteria.local_trips_count) {
      return getProgress(achievement, countries, visited, trips, homeCountry);
    }
    // Abroad trips (unique countries)
    if (criteria.abroad_countries_count) {
      return getProgress(achievement, countries, visited, trips, homeCountry);
    }
    // Abroad trips (number of trips)
    if (criteria.abroad_trips_count) {
      return `Abroad trips: ${getProgress(achievement, countries, visited, trips, homeCountry)}`;
    }
    // Repeat visits
    if (criteria.repeat_visits_count) {
      return getProgress(achievement, countries, visited, trips, homeCountry);
    }
    // Default
    return getProgress(achievement, countries, visited, trips, homeCountry);
  }, [achievement, countries, visited, trips, homeCountry, status]);
}
