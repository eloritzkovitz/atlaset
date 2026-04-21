import { useMemo } from "react";
import type { Country } from "@features/countries";
import { getProgress } from "../utils/achievements";
import type { Achievement } from "../types";

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

    // Criterias that do not have a progress label
    if (achievement.type === "trips") {
      return "";
    }

    // Default
    return String(getProgress(achievement, countries, visited));
  }, [achievement, countries, visited, achievementStatusMap]);
}
