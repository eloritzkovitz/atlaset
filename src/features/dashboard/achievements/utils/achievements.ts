/**
 * Utility functions for handling achievements.
 */

import { type Country } from "@features/countries";
import {
  getLocalTrips,
  getAbroadTrips,
  getCompletedTrips,
  getTripDays,
  type Trip,
} from "@features/trips";
import { buildVisitContext } from "@features/visits";
import { formatFraction } from "@utils";
import { getAchievementCountries } from "./achievementFilters";
import type { Achievement, AchievementStatus, Criteria } from "../types";

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
  visited: { isVisitedCountry: (iso: string) => boolean },
  tierCount?: number,
  trips?: Trip[],
  homeCountry?: string,
) {
  const visitCtx = buildVisitContext(trips ?? [], undefined, homeCountry);
  const achCountries = getAchievementCountries(achievement, countries, {
    visitedIsoCodes: visitCtx.visitedIsoCodes,
    visitedMap: visitCtx.visitedMap,
    visitedYearMap: visitCtx.visitedYearMap,
  });
  const criteria: Criteria = achievement.criteria || {};
  const filteredAchCountries =
    criteria.only_abroad && homeCountry
      ? achCountries.filter((c) => c.isoCode !== homeCountry)
      : achCountries;
  const list =
    typeof tierCount === "number"
      ? filteredAchCountries.slice(0, tierCount)
      : filteredAchCountries;
  return list.filter((c) => visited.isVisitedCountry(c.isoCode)).length;
}

/**
 * Get the total count of countries for the achievement
 * @param achievement - The achievement object
 * @param countries - List of all countries
 * @returns Total number of countries relevant to the achievement
 */
export function getTotalCount(
  achievement: Achievement,
  countries: Country[],
  tierCount?: number,
) {
  // If using root-level countries and a tier count, return the tier count
  if (achievement.countries && typeof tierCount === "number") {
    return Math.min(achievement.countries.length, tierCount);
  }
  const criteria = achievement.criteria || {};
  if (criteria.countries) {
    return criteria.countries.length as number;
  }
  if (criteria.required) {
    return criteria.required as number;
  }
  return getAchievementCountries(achievement, countries).length;
}

/**
 * Gets the progress counts for region-based achievements.
 * @param criteria - The achievement criteria
 * @param countries - List of all countries
 * @param visited - Optional utility to check if a country has been visited
 * @returns - Object containing completed and required counts, or null if not region-based
 */
export function getRegionProgressCounts(
  criteria: Criteria,
  countries: Country[],
  visited?: { isVisitedCountry: (iso: string) => boolean },
) {
  const rawRegions = (criteria as Record<string, unknown>).regions;
  const regionsArr: string[] =
    typeof rawRegions === "string"
      ? [rawRegions]
      : Array.isArray(rawRegions)
        ? (rawRegions as string[])
        : [];
  if (regionsArr.length === 0) return null;

  const completed = regionsArr.reduce((acc, region) => {
    const hasVisitedCountry = countries.some((c) =>
      c.region === region
        ? visited
          ? visited.isVisitedCountry(c.isoCode)
          : true
        : false,
    );
    return acc + (hasVisitedCountry ? 1 : 0);
  }, 0);

  const cfg = criteria as Record<string, unknown>;
  const maybeRequired = Number(cfg.required);
  const required = Number.isFinite(maybeRequired)
    ? maybeRequired
    : regionsArr.length;

  return { completed, required };
}

/**
 * Calculates the progress metrics for an achievement, including current and total counts.
 * @param achievement - The achievement object.
 * @param countries - List of all countries.
 * @param visited - Visited countries utility.
 * @param trips - Optional array of user trips.
 * @param homeCountry - Optional home country ISO code.
 * @returns Object containing current and total counts for the achievement progress.
 */
function getProgressMetrics(
  achievement: Achievement,
  countries: Country[],
  visited: { isVisitedCountry: (iso: string) => boolean },
  trips?: Trip[],
  homeCountry?: string,
) {
  const criteria = achievement.criteria || {};

  // Calculate progress for region-based achievements
  const regionCounts = getRegionProgressCounts(criteria, countries, visited);
  if (regionCounts) {
    return { current: regionCounts.completed, total: regionCounts.required };
  }

  // Calculate progress for trip-based achievements
  if (trips) {
    if (criteria.trip_countries_count) {
      const minCountries = criteria.trip_countries_count;
      if (criteria.regions?.length === 1) {
        const regionCodes = new Set(
          countries
            .filter((c) => c.region === criteria.regions![0])
            .map((c) => c.isoCode),
        );
        const maxRegionCount = Math.max(
          0,
          ...trips.map(
            (t) =>
              t.countryCodes.filter((code) => regionCodes.has(code)).length,
          ),
        );
        return { current: maxRegionCount, total: minCountries };
      }
      const maxAnyTripCount = Math.max(
        0,
        ...trips.map((t) => new Set(t.countryCodes).size),
      );
      return { current: maxAnyTripCount, total: minCountries };
    }

    if (criteria.local_trips_count && homeCountry) {
      return {
        current: getCompletedTrips(getLocalTrips(trips, homeCountry)).length,
        total: criteria.local_trips_count,
      };
    }

    if (criteria.abroad_trips_count && homeCountry) {
      return {
        current: getCompletedTrips(getAbroadTrips(trips, homeCountry)).length,
        total: criteria.abroad_trips_count,
      };
    }

    if (criteria.trip_duration_days) {
      const completed = getCompletedTrips(trips);
      const maxDays =
        completed.length > 0
          ? Math.max(...completed.map((t) => getTripDays(t)))
          : 0;
      return { current: maxDays, total: criteria.trip_duration_days };
    }
  }

  // Default progress calculation based on visited countries
  const visitedCount = getVisitedCount(
    achievement,
    countries,
    visited,
    undefined,
    trips,
    homeCountry,
  );
  if (criteria.required) {
    return {
      current: Math.min(visitedCount, criteria.required),
      total: criteria.required,
    };
  }

  return {
    current: visitedCount,
    total: getTotalCount(achievement, countries),
  };
}

/**
 * Gets the progress string for an achievement.
 * @param achievement - The achievement object
 * @param countries - List of all countries
 * @param visited - Visited countries utility
 * @returns Progress string in the format "visited/total"
 */
export function getProgress(
  achievement: Achievement,
  countries: Country[],
  visited: { isVisitedCountry: (iso: string) => boolean },
  trips?: Trip[],
  homeCountry?: string,
  showPercent = false,
) {
  const { current, total } = getProgressMetrics(
    achievement,
    countries,
    visited,
    trips,
    homeCountry,
  );

  if (!total) return "";

  return formatFraction(current, total, { showPercent });
}

/**
 * Gets the progress fraction for an achievement.
 * @param achievement - The achievement object
 * @param countries - List of all countries
 * @param visited - Visited countries utility
 * @returns Progress fraction between 0 and 1
 */
export function getProgressFraction(
  achievement: Achievement,
  countries: Country[],
  visited: { isVisitedCountry: (iso: string) => boolean },
  trips?: Trip[],
  homeCountry?: string,
) {
  const { current, total } = getProgressMetrics(
    achievement,
    countries,
    visited,
    trips,
    homeCountry,
  );
  return total > 0 ? Math.min(current / total, 1) : 0;
}

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
 * @param achievement - The achievement object
 * @param countries - List of all countries
 * @param visited - Visited countries utility
 * @param trips - Array of user trips
 * @param homeCountry - The user's home country
 * @param achievementStatusMap - Map of achievementId to completion status (for dependency achievements)
 * @returns True if the achievement is completed, false otherwise
 */
export function isCompleted(
  achievement: Achievement,
  countries: Country[],
  visited: { isVisitedCountry: (iso: string) => boolean },
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
    visited,
    trips,
    homeCountry,
  );
  return total > 0 && current >= total;
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
  visited: { isVisitedCountry: (iso: string) => boolean },
  trips?: Trip[],
  homeCountry?: string,
): AchievementStatus {
  if (isCompleted(achievement, countries, visited, trips, homeCountry))
    return "completed";
  if (
    getProgressFraction(achievement, countries, visited, trips, homeCountry) > 0
  )
    return "progress";
  return "locked";
}

/**
 * Finds the active tier for a set of tiered achievements based on completion status.
 * @param tiers - The array of tiered achievements.
 * @param countries - List of all countries.
 * @param visited - Visited countries utility.
 * @param trips - Optional array of user trips.
 * @param homeCountry - Optional home country ISO code.
 * @returns The active tier achievement, or null if no tiers are provided.
 */
function findActiveTier(
  tiers: Achievement[],
  countries: Country[],
  visited: { isVisitedCountry: (iso: string) => boolean },
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
      isCompleted(ach, countries, visited, trips, homeCountry),
    );
  const highestCompletedIdx =
    reversedIdx === -1 ? -1 : sorted.length - 1 - reversedIdx;

  return highestCompletedIdx === -1
    ? sorted[0]
    : sorted[Math.min(highestCompletedIdx + 1, sorted.length - 1)];
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
  if (ach.tiers && Array.isArray(ach.tiers) && ach.tiers.length > 0) {
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
 * Merges achievements to show only relevant tiered achievements and calculates progress
 * @param achievements - List of all achievements
 * @param countries - List of all countries
 * @param visited - Visited countries utility
 * @param trips - Array of user trips
 * @param homeCountry - The user's home country
 * @returns Array of merged achievements with their progress metrics
 */
export function getMergedAchievements(
  achievements: Achievement[],
  countries: Country[],
  visited: { isVisitedCountry: (iso: string) => boolean },
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
    visited,
    trips,
    homeCountry,
  );
  if (activeWorld) merged.push(activeWorld);

  Object.values(regionTiers).forEach((tiers) => {
    const activeRegion = findActiveTier(
      tiers,
      countries,
      visited,
      trips,
      homeCountry,
    );
    if (activeRegion) merged.push(activeRegion);
  });

  return merged.map((ach) => ({
    ...ach,
    progress: getProgressFraction(ach, countries, visited, trips, homeCountry),
  }));
}

/**
 * Calculates the global progress of an achievement, considering all tiers and their completion status.
 * @param ach - The achievement object
 * @param countries - List of all countries
 * @param visited - Visited countries utility
 * @param trips - Optional array of user trips
 * @param homeCountry - Optional home country ISO code
 * @returns A normalized decimal number between 0 and 1
 */
export function getGlobalAchievementProgress(
  ach: Achievement,
  countries: Country[],
  visited: { isVisitedCountry: (iso: string) => boolean },
  trips?: Trip[],
  homeCountry?: string,
  allAchievements?: Achievement[],
): number {
  const siblingTiers = getSiblingTiers(ach, allAchievements);
  if (siblingTiers.length === 0) return ach.progress ?? 0;

  const completedCount = siblingTiers.filter((tier) =>
    isCompleted(tier, countries, visited, trips, homeCountry),
  ).length;
  return completedCount / siblingTiers.length;
}
