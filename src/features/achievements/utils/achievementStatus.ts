/**
 * Utility functions for handling achievements.
 */

import { type Country } from "@features/countries/types";
import type { Trip } from "@features/trips/types";
import { getProgressMetrics } from "./achievementProgress";
import type { Achievement, AchievementStatus } from "../types";

/**
 * Checks if all required achievements are completed.
 * @param achievement - The achievement object
 * @param achievementStatusMap - Map of achievementId to completion status
 * @returns True if all requirements are completed or none required
 */
export function areRequirementsCompleted(
  achievement: Achievement,
  achievementStatusMap: Record<string, boolean>,
): boolean {
  if (!achievement.requires || achievement.requires.length === 0) return true;
  return achievement.requires.every((id) => achievementStatusMap[id]);
}

/**
 * Determines if the achievement is completed, including dependency requirements.
 * @param achievement - The achievement object.
 * @param countries - List of all countries.
 * @param isVisitedCountry - Function to check if a country is visited.
 * @param trips - Array of user trips.
 * @param homeCountry - The user's home country.
 * @param achievementStatusMap - Map of achievementId to completion status.
 * @returns True if the achievement is completed, false otherwise.
 */
export function isCompleted(
  achievement: Achievement,
  countries: Country[],
  isVisitedCountry: (isoCode: string) => boolean,
  trips?: Trip[],
  homeCountry?: string,
  achievementStatusMap?: Record<string, boolean>,
) {
  if (
    achievementStatusMap &&
    !areRequirementsCompleted(achievement, achievementStatusMap)
  ) {
    return false;
  }

  const { current, total } = getProgressMetrics(
    achievement,
    countries,
    isVisitedCountry,
    trips,
    homeCountry,
  );
  return total > 0 && current >= total;
}

/**
 * Gets the achievement status
 * @param achievement - The achievement object
 * @param countries - List of all countries
 * @param isVisitedCountry - Function to check if a country is visited
 * @returns "locked", "progress", or "completed" based on achievement status
 */
export function getAchievementStatus(
  achievement: Achievement,
  countries: Country[],
  isVisitedCountry: (isoCode: string) => boolean,
  trips?: Trip[],
  homeCountry?: string,
): AchievementStatus {
  const { current, total } = getProgressMetrics(
    achievement,
    countries,
    isVisitedCountry,
    trips,
    homeCountry,
  );

  if (total > 0 && current >= total) return "completed";
  if (current > 0) return "progress";

  return "locked";
}

/**
 * Calculates the number of completed achievements from a list of achievements.
 * @param achievements - List of achievements to evaluate.
 * @param countries - List of all countries.
 * @param isVisitedCountry - Function to check if a country is visited.
 * @param trips - Optional array of user trips.
 * @param homeCountry - Optional home country ISO code.
 * @returns The count of completed achievements.
 */
export function getCompletedAchievementsCount(
  achievements: Achievement[] | undefined,
  countries: Country[],
  isVisitedCountry: (isoCode: string) => boolean,
  trips?: Trip[],
  homeCountry?: string,
): number {
  return (
    achievements?.filter((achievement) =>
      isCompleted(achievement, countries, isVisitedCountry, trips, homeCountry),
    ).length ?? 0
  );
}
