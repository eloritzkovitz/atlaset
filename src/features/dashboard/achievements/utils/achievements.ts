/**
 * Utility functions for handling achievements in the dashboard.
 */

import type { Country } from "@features/countries";
import type { Achievement, AchievementStatus } from "../../types";

/**
 * Gets the list of countries relevant to the achievement criteria.
 * @param achievement - The achievement object
 * @param countries - List of all countries
 * @returns Array of countries relevant to the achievement
 */
export function getAchievementCountries(
  achievement: Achievement,
  countries: Country[],
) {
  if (achievement.criteria.region) {
    return countries.filter(
      (c) =>
        c.region === achievement.criteria.region &&
        c.sovereigntyType === "Sovereign",
    );
  }
  if (achievement.criteria.subregion) {
    return countries.filter(
      (c) =>
        c.subregion === achievement.criteria.subregion &&
        c.sovereigntyType === "Sovereign",
    );
  }
  if (achievement.criteria.countries) {
    return countries.filter((c) =>
      achievement.criteria.countries.includes(c.isoCode),
    );
  }
  // For world achievements, return all sovereign countries
  if (
    achievement.criteria.count &&
    !achievement.criteria.region &&
    !achievement.criteria.subregion &&
    !achievement.criteria.countries
  ) {
    return countries.filter((c) => c.sovereigntyType === "Sovereign");
  }
  return [];
}

/**
 * Get the count of visited countries for the achievement
 * @param achievement - The achievement object
 * @param countries - List of all countries
 * @param visited - Visited countries utility
 * @returns Number of visited countries relevant to the achievement
 */
export function getVisitedCount(
  achievement: Achievement,
  countries: Country[],
  visited: { isCountryVisited: (iso: string) => boolean },
) {
  const achCountries = getAchievementCountries(achievement, countries);
  return achCountries.filter((c) => visited.isCountryVisited(c.isoCode)).length;
}

/**
 * Get the total count of countries for the achievement
 * @param achievement - The achievement object
 * @param countries - List of all countries
 * @returns Total number of countries relevant to the achievement
 */
export function getTotalCount(achievement: Achievement, countries: Country[]) {
  if (achievement.criteria.countries) {
    return achievement.criteria.countries.length;
  }
  const achCountries = getAchievementCountries(achievement, countries);
  if (achievement.criteria.count) {
    return achievement.criteria.count;
  }
  return achCountries.length;
}

/**
 * Gets progress string for the achievement
 * @param achievement - The achievement object
 * @param countries - List of all countries
 * @param visited - Visited countries utility
 * @returns Progress string in the format "visited/total"
 */
export function getProgress(
  achievement: Achievement,
  countries: Country[],
  visited: { isCountryVisited: (iso: string) => boolean },
) {
  const visitedCount = getVisitedCount(achievement, countries, visited);
  const total = getTotalCount(achievement, countries);
  return total ? `${visitedCount}/${total}` : "";
}

/**
 * Gets progress fraction for the achievement
 * @param achievement - The achievement object
 * @param countries - List of all countries
 * @param visited - Visited countries utility
 * @returns Progress fraction between 0 and 1
 */
export function progressFraction(
  achievement: Achievement,
  countries: Country[],
  visited: { isCountryVisited: (iso: string) => boolean },
) {
  const visitedCount = getVisitedCount(achievement, countries, visited);
  const total = getTotalCount(achievement, countries);
  return total > 0 ? Math.min(visitedCount / total, 1) : 0;
}

/**
 * Determines if the achievement is completed
 * @param achievement - The achievement object
 * @param countries - List of all countries
 * @param visited - Visited countries utility
 * @returns True if completed, false otherwise
 */
export function isCompleted(
  achievement: Achievement,
  countries: Country[],
  visited: { isCountryVisited: (iso: string) => boolean },
) {
  const visitedCount = getVisitedCount(achievement, countries, visited);
  const total = getTotalCount(achievement, countries);
  if (achievement.criteria.count) {
    return visitedCount >= achievement.criteria.count;
  }
  return visitedCount === total && total > 0;
}

/**
 * Gets the achievement status
 * @param achievement - The achievement object
 * @param countries - List of all countries
 * @param visited - Visited countries utility
 * @returns "locked", "progress", or "completed" based on achievement status
 */
export function getAchievementStatus(
  achievement: Achievement,
  countries: Country[],
  visited: { isCountryVisited: (iso: string) => boolean },
): AchievementStatus {
  if (isCompleted(achievement, countries, visited)) return "completed";
  if (progressFraction(achievement, countries, visited) > 0) return "progress";
  return "locked";
}

/**
 * Gets the tier of the achievement if applicable
 * @param achievement - The achievement object
 * @returns - Tier number or undefined if not tiered
 */
export function getTier(achievement: Achievement): number | undefined {
  return achievement.criteria && typeof achievement.criteria.tier === "number"
    ? achievement.criteria.tier
    : undefined;
}

/**
 * Merges achievements to show only relevant tiered achievements
 * @param achievements - List of all achievements
 * @param countries - List of all countries
 * @param visited - Visited countries utility
 * @returns Array of merged achievements
 */
export function getMergedAchievements(
  achievements: Achievement[],
  countries: Country[],
  visited: { isCountryVisited: (iso: string) => boolean },
) {
  const worldTiers: Achievement[] = [];
  const regionTiers: Record<string, Achievement[]> = {};
  const others: Achievement[] = [];
  for (const ach of achievements) {
    if (
      ach.criteria &&
      ach.criteria.tier &&
      ach.criteria.count &&
      !ach.criteria.region &&
      !ach.criteria.subregion &&
      !ach.criteria.countries
    ) {
      worldTiers.push(ach);
    } else if (ach.criteria && ach.criteria.region && ach.criteria.tier) {
      const key = ach.criteria.region;
      if (!regionTiers[key]) regionTiers[key] = [];
      regionTiers[key].push(ach);
    } else {
      others.push(ach);
    }
  }

  let worldToShow: Achievement | null = null;
  if (worldTiers.length > 0) {
    const sorted = [...worldTiers].sort(
      (a, b) => (a.criteria.tier || 0) - (b.criteria.tier || 0),
    );
    worldToShow = sorted[0];
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (isCompleted(sorted[i], countries, visited)) {
        worldToShow = sorted[i];
        if (i === sorted.length - 1) {
          break;
        }
        if (i + 1 < sorted.length) {
          worldToShow = sorted[i + 1];
          break;
        } else {
          break;
        }
      }
    }
  }

  const merged: Achievement[] = [];
  Object.values(regionTiers).forEach((tiers) => {
    const sorted = [...tiers].sort(
      (a, b) => (a.criteria.tier || 0) - (b.criteria.tier || 0),
    );
    let toShow = sorted[0];
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (isCompleted(sorted[i], countries, visited)) {
        toShow = sorted[i];
        if (i === sorted.length - 1) {
          merged.push(toShow);
          return;
        }
        if (i + 1 < sorted.length) {
          merged.push(sorted[i + 1]);
          return;
        } else {
          merged.push(toShow);
          return;
        }
      }
    }
    merged.push(sorted[0]);
  });

  const result: Achievement[] = [];
  if (worldToShow) result.push(worldToShow);
  return [...result, ...merged, ...others];
}
