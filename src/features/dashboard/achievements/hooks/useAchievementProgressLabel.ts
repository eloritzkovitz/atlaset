import { useMemo } from "react";
import type { Country } from "@features/countries";
import type { Trip } from "@features/trips";
import { getProgress } from "../utils/achievements";
import type { Achievement } from "../../types";

/**
 * Generates a progress label for an achievement card.
 * @param achievement - The achievement object
 * @param countries - List of all countries
 * @param visited - Object with method to check if a country is visited
 * @param trips - Optional list of user's trips
 * @param homeCountry - Optional home country ISO code
 * @param achievementStatusMap - Optional map of achievement completion for dependencies
 * @returns Progress label string
 */
export function useAchievementProgressLabel(
  achievement: Achievement,
  countries: Country[],
  visited: { isCountryVisited: (iso: string) => boolean },
  trips?: Trip[],
  homeCountry?: string,
  achievementStatusMap?: Record<string, boolean>,
) {
  return useMemo(() => {
    const criteria = achievement.criteria || {};
    // Dependency-only achievements
    if (
      achievement.requires &&
      Array.isArray(achievement.requires) &&
      achievement.requires.length > 0 &&
      (!achievement.criteria || Object.keys(criteria).length === 0) &&
      achievementStatusMap
    ) {
      const completedCount = achievement.requires.filter(
        (reqId) => achievementStatusMap[reqId],
      ).length;
      return `${completedCount}/${achievement.requires.length}`;
    }

    // Country-based achievements
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

    // Trip-based achievements - local or abroad countries count
    if (criteria.local_trips_count || criteria.abroad_countries_count) {
      return String(
        getProgress(achievement, countries, visited, trips, homeCountry),
      );
    }

    // Criterias that do not have a progress label
    if (
      criteria.trip_countries_count ||
      criteria.trip_duration_days ||
      criteria.abroad_trips_count ||
      criteria.repeat_visits_count
    ) {
      return "";
    }

    // Default
    return String(
      getProgress(achievement, countries, visited, trips, homeCountry),
    );
  }, [
    achievement,
    countries,
    visited,
    trips,
    homeCountry,
    achievementStatusMap,
  ]);
}
