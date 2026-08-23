/**
 * Utility functions for handling tiered achievements.
 */

import type { Country } from "@features/countries/types";
import type { Trip } from "@features/trips/types";
import { getProgressFraction } from "./achievementProgress";
import { getAchievementStatus, isCompleted } from "./achievementStatus";
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
  isVisitedCountry: (iso: string) => boolean,
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
    isVisitedCountry,
    trips,
    homeCountry,
  );

  if (achievement.tiers?.length) {
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
          isVisitedCountry,
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
      isVisitedCountry,
      trips,
      homeCountry,
    );
  }

  return { tierObj, tierIndex, tierStatus };
}

/**
 * Gets the sibling tiers of an achievement, if any.
 * @param ach - The achievement object
 * @param allAchievements - Optional list of all achievements to find siblings
 * @returns Array of sibling tier achievements, or empty array if none found
 */
function getSiblingTiers(
  ach: Achievement,
  allAchievements?: Achievement[],
): Achievement[] {
  if (ach.tiers?.length) {
    return ach.tiers.map((t) =>
      t.criteria ? { ...ach, criteria: t.criteria } : { ...ach },
    );
  }
  if (!allAchievements || !ach.criteria?.tier) return [];
  const { count, countries: critCountries, regions } = ach.criteria;

  return allAchievements.filter((a) => {
    const c = a.criteria || {};
    if (!c.tier || c.count !== count) return false;
    if (critCountries || c.countries)
      return String(critCountries) === String(c.countries);
    return Array.isArray(regions) && Array.isArray(c.regions)
      ? regions[0] === c.regions[0]
      : !regions && !c.regions;
  });
}

/**
 * Finds the active tier for a set of tiered achievements based on completion status.
 * @param tiers - The array of tiered achievements.
 * @param countries - List of all countries.
 * @param isVisitedCountry - Function to check if a country is visited.
 * @param trips - Optional array of user trips.
 * @param homeCountry - Optional home country ISO code.
 * @returns The active tier achievement, or null if no tiers are provided.
 */
function findActiveTier(
  tiers: Achievement[],
  countries: Country[],
  isVisitedCountry: (isoCode: string) => boolean,
  trips?: Trip[],
  homeCountry?: string,
): Achievement | null {
  if (tiers.length === 0) return null;
  const sorted = [...tiers].sort(
    (a, b) => (a.criteria?.tier ?? 0) - (b.criteria?.tier ?? 0),
  );

  // Find the highest completed tier and return the next tier if available
  const reversedIdx = [...sorted]
    .reverse()
    .findIndex((ach) =>
      isCompleted(ach, countries, isVisitedCountry, trips, homeCountry),
    );
  const highestCompletedIdx =
    reversedIdx === -1 ? -1 : sorted.length - 1 - reversedIdx;

  return highestCompletedIdx === -1
    ? sorted[0]
    : sorted[Math.min(highestCompletedIdx + 1, sorted.length - 1)];
}

/**
 * Merges achievements to show only relevant tiered achievements and calculates progress
 * @param achievements - List of all achievements
 * @param countries - List of all countries
 * @param isVisitedCountry - Function to check if a country is visited
 * @param trips - Array of user trips
 * @param homeCountry - The user's home country
 * @returns Array of merged achievements with their progress metrics
 */
export function getMergedAchievements(
  achievements: Achievement[],
  countries: Country[],
  isVisitedCountry: (isoCode: string) => boolean,
  trips?: Trip[],
  homeCountry?: string,
): Achievement[] {
  const worldTiers: Achievement[] = [];
  const regionTiers: Record<string, Achievement[]> = {};
  const others: Achievement[] = [];

  for (const ach of achievements) {
    const c = ach.criteria || {};
    if (
      c.tier &&
      c.count &&
      (!c.regions || c.regions.length === 0) &&
      !c.countries
    ) {
      worldTiers.push(ach);
    } else if (c.tier && Array.isArray(c.regions) && c.regions.length === 1) {
      (regionTiers[c.regions[0]] ??= []).push(ach);
    } else {
      others.push(ach);
    }
  }

  const merged = [...others];
  const activeWorld = findActiveTier(
    worldTiers,
    countries,
    isVisitedCountry,
    trips,
    homeCountry,
  );
  if (activeWorld) merged.push(activeWorld);

  Object.values(regionTiers).forEach((tiers) => {
    const activeRegion = findActiveTier(
      tiers,
      countries,
      isVisitedCountry,
      trips,
      homeCountry,
    );
    if (activeRegion) merged.push(activeRegion);
  });

  return merged.map((ach) => ({
    ...ach,
    progress: getProgressFraction(
      ach,
      countries,
      isVisitedCountry,
      trips,
      homeCountry,
    ),
  }));
}

/**
 * Calculates the global progress of an achievement, considering all tiers and their completion status.
 * @param ach - The achievement object
 * @param countries - List of all countries
 * @param isVisitedCountry - Function to check if a country is visited
 * @param trips - Optional array of user trips
 * @param homeCountry - Optional home country ISO code
 * @returns A normalized decimal number between 0 and 1
 */
export function getGlobalAchievementProgress(
  ach: Achievement,
  countries: Country[],
  isVisitedCountry: (isoCode: string) => boolean,
  trips?: Trip[],
  homeCountry?: string,
  allAchievements?: Achievement[],
): number {
  const siblingTiers = getSiblingTiers(ach, allAchievements);
  if (siblingTiers.length === 0) return ach.progress ?? 0;

  const completedCount = siblingTiers.filter((tier) =>
    isCompleted(tier, countries, isVisitedCountry, trips, homeCountry),
  ).length;
  return completedCount / siblingTiers.length;
}
