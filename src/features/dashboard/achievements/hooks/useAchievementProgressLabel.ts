import { useMemo } from "react";
import type { Country } from "@features/countries/types";
import type { Trip } from "@features/trips/types";
import { formatFraction } from "@utils";
import { getProgress } from "../utils/achievements";
import type { Achievement } from "../types";

export interface AchievementProgressLabelOptions {
  trips?: Trip[];
  homeCountry?: string;
  achievementStatusMap?: Record<string, boolean>;
  showPercent?: boolean;
}

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
  isVisitedCountry: (iso: string) => boolean,
  options: AchievementProgressLabelOptions = {},
) {
  const {
    trips,
    homeCountry,
    achievementStatusMap,
    showPercent = false,
  } = options;

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

      return formatFraction(completedCount, achievement.requires.length, {
        showPercent,
      });
    }

    // Criteria that do not have a progress label
    if (achievement.type === "trips") {
      return "";
    }

    // Default
    return getProgress(
      achievement,
      countries,
      isVisitedCountry,
      trips,
      homeCountry,
      showPercent,
    );
  }, [
    achievement,
    countries,
    isVisitedCountry,
    trips,
    homeCountry,
    achievementStatusMap,
    showPercent,
  ]);
}
