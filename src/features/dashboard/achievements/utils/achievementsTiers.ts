/**
 * Utility functions for handling tiered achievements.
 */

import type { Country } from "@features/countries/types";
import type { Trip } from "@features/trips/types";
import { getAchievementStatus } from "./achievements";
import type { Achievement, AchievementStatus, Tier } from "../types";

/**
 * Gets the tier of the achievement if applicable.
 * @param achievement - The achievement object
 * @returns - Tier number or undefined if not tiered
 */
export function getTier(achievement: Achievement): number | undefined {
  const criteria = achievement.criteria || {};
  return typeof criteria.tier === "number" ? criteria.tier : undefined;
}

/**
 * Gets the current tier of a tiered achievement.
 * @param achievement - The achievement object
 * @param countries - List of all countries
 * @param visited - Visited countries utility
 * @param trips - Array of user trips
 * @param homeCountry - The user's home country
 * @returns Object containing tier details
 */
export function getCurrentTier(
  achievement: Achievement,
  countries: Country[],
  visited: { isVisitedCountry: (iso: string) => boolean },
  trips?: Trip[],
  homeCountry?: string,
): {
  tierObj: Tier | null;
  tierIndex: number;
  tierStatus: AchievementStatus;
  tierCount?: number;
} {
  let tierIndex = 0;
  let tierObj: Tier | null = null;
  let tierStatus: AchievementStatus = getAchievementStatus(
    achievement,
    countries,
    visited,
    trips,
    homeCountry,
  );

  if (
    achievement.tiers &&
    Array.isArray(achievement.tiers) &&
    achievement.tiers.length > 0
  ) {
    let foundCompleted = false;
    for (let i = achievement.tiers.length - 1; i >= 0; i--) {
      const t = achievement.tiers[i];
      const tierAch = t.criteria
        ? { ...achievement, criteria: t.criteria }
        : { ...achievement };
      const completed =
        getAchievementStatus(
          tierAch,
          countries,
          visited,
          trips,
          homeCountry,
        ) === "completed";
      if (completed) {
        tierIndex = i;
        foundCompleted = true;
        break;
      }
    }
    if (foundCompleted && tierIndex < achievement.tiers.length - 1) {
      tierIndex++;
    }
    tierObj = achievement.tiers[tierIndex];
    const tierAch = tierObj.criteria
      ? { ...achievement, criteria: tierObj.criteria }
      : { ...achievement };
    tierStatus = getAchievementStatus(
      tierAch,
      countries,
      visited,
      trips,
      homeCountry,
    );
  }

  return { tierObj, tierIndex, tierStatus };
}
