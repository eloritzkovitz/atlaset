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
    if (
      achievement.criteria.regions &&
      Array.isArray(achievement.criteria.regions)
    ) {
      const completedCount = achievement.criteria.regions.filter(
        (region: string) => {
          const countriesInRegion = countries.filter(
            (c) => c.region === region,
          );
          return countriesInRegion.some((c) =>
            visited.isCountryVisited(c.isoCode),
          );
        },
      ).length;
      const minRequired =
        achievement.criteria.min_regions || achievement.criteria.regions.length;
      return `Progress: ${completedCount}/${minRequired}`;
    }
    if (
      achievement.criteria.trip_countries_count &&
      achievement.criteria.region
    ) {
      return status === "completed"
        ? "Trip completed"
        : "No qualifying trip yet";
    }
    if (achievement.criteria.trip_duration_days) {
      return status === "completed"
        ? "Trip completed"
        : "No qualifying trip yet";
    }
    if (achievement.criteria.abroad_trips_count) {
      return `Abroad trips: ${getProgress(achievement, countries, visited, trips, homeCountry)}`;
    }
    return `Progress: ${getProgress(achievement, countries, visited, trips, homeCountry)}`;
  }, [achievement, countries, visited, trips, homeCountry, status]);
}
