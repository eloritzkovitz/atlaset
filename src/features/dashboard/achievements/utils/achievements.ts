/**
 * Utility functions for handling achievements.
 */

import {
  applyQualifierSearch,
  type Country,
  type CountryFilterOptions,
} from "@features/countries";
import {
  getLocalTrips,
  getAbroadTrips,
  getCompletedTrips,
  getTripDays,
  type Trip,
} from "@features/trips";
import type { Achievement, AchievementStatus, Criteria } from "../types";
import {
  getRepeatVisitCount,
  getUniqueAbroadCountries,
} from "../../statistics/utils/visitStats";

// Helper to build filter params from criteria for qualifier search
function buildFilterParamsFromCriteria(
  criteria: Criteria,
): CountryFilterOptions {
  const { sovereign } = criteria as unknown as { sovereign?: boolean };
  const selectedSovereignty = sovereign === false ? "" : "Sovereign";
  return { selectedSovereignty, modifiers: {}, search: "" };
}

// Helper to extract entries from criteria, excluding null/undefined values
function entriesFromCriteria(criteria: Criteria) {
  return Object.entries(criteria || {}).filter(([, v]) => v != null);
}

// Helper to check if criteria has any selectors
function hasSelectors(criteria: Criteria) {
  return entriesFromCriteria(criteria).some(
    ([k]) => k !== "count" && k !== "tier" && k !== "sovereign",
  );
}

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
  const criteria: Criteria = achievement.criteria || {};
  const filterParams = buildFilterParamsFromCriteria(criteria);

  // Root-level countries array
  if (achievement.countries && Array.isArray(achievement.countries)) {
    const set = new Set((achievement.countries as string[]).map(String));
    const explicit = countries.filter((c) => set.has(c.isoCode));
    const explicitFilterParams = {
      ...filterParams,
      selectedSovereignty: "",
    } as CountryFilterOptions;
    return applyQualifierSearch(
      explicit,
      "",
      undefined,
      explicitFilterParams,
      explicit.map((c) => c.isoCode),
    );
  }

  // Find selectors and combine them with AND semantics
  const entries = entriesFromCriteria(criteria);
  const selectors = entries.filter(
    ([k]) => !["count", "tier", "sovereign"].includes(k),
  );
  if (selectors.length > 0) {
    let byQualifier = countries.slice();

    for (const [k, v] of selectors) {
      // explicit countries list selector: intersect with current set
      if (k === "countries" && Array.isArray(v)) {
        const set = new Set((v as unknown[]).map(String));
        byQualifier = byQualifier.filter((c) => set.has(c.isoCode));
        continue;
      }

      const vals = (
        Array.isArray(v) && (v as unknown[]).length
          ? (v as unknown[])
          : [v as unknown]
      ).map(String);

      // For other selectors, apply qualifier search and intersect results
      const thisQualIso = new Set<string>();
      for (const val of vals) {
        const search = `${k}:${val}`;
        const matched = applyQualifierSearch(
          byQualifier,
          search,
          undefined,
          filterParams,
          byQualifier.map((c) => c.isoCode),
        );
        for (const c of matched) thisQualIso.add(c.isoCode);
      }

      // Intersect with current set
      byQualifier = byQualifier.filter((c) => thisQualIso.has(c.isoCode));
      if (byQualifier.length === 0) break;
    }

    if (byQualifier.length > 0) return byQualifier;
  }

  // If no selectors and count-based, return empty country list for display
  if (criteria.count && !hasSelectors(criteria)) return [];
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
  tierCount?: number,
) {
  const criteria: Criteria = achievement.criteria || {};
  const hasSel = hasSelectors(criteria);

  // Count-only achievements: count visited across sovereign-filtered set
  if (criteria.count && !hasSel) {
    const filterParams = buildFilterParamsFromCriteria(criteria);
    const filtered = applyQualifierSearch(
      countries,
      "",
      undefined,
      filterParams,
      countries.map((c) => c.isoCode),
    );
    return filtered.filter((c) => visited.isCountryVisited(c.isoCode)).length;
  }

  // Otherwise, use achievement-specific country list
  let achCountries = getAchievementCountries(achievement, countries);
  if (achievement.countries && typeof tierCount === "number") {
    achCountries = achCountries.slice(0, tierCount);
  }
  return achCountries.filter((c) => visited.isCountryVisited(c.isoCode)).length;
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
  const achCountries = getAchievementCountries(achievement, countries);
  if (criteria.count) {
    return criteria.count as number;
  }
  return achCountries.length;
}

// Compute region-based progress counts. Returns null if not region-based.
function regionProgressCounts(
  criteria: Criteria,
  countries: Country[],
  visited?: { isCountryVisited: (iso: string) => boolean },
) {
  if (!criteria.regions || !Array.isArray(criteria.regions)) return null;
  const completed = criteria.regions.filter((region: string) => {
    const countriesInRegion = countries.filter((c) => c.region === region);
    return visited
      ? countriesInRegion.some((c) => visited.isCountryVisited(c.isoCode))
      : countriesInRegion.length > 0;
  }).length;
  const required = criteria.min_regions || criteria.regions.length;
  return { completed, required };
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
  visited: { isCountryVisited: (iso: string) => boolean },
) {
  const criteria = achievement.criteria || {};
  const regionCounts = regionProgressCounts(criteria, countries, visited);
  if (regionCounts) return `${regionCounts.completed}/${regionCounts.required}`;
  const visitedCount = getVisitedCount(achievement, countries, visited);
  if ((criteria.countries || criteria.regions) && criteria.count) {
    const count = criteria.count as number;
    return `${Math.min(visitedCount, count)}/${count}`;
  }
  const total = getTotalCount(achievement, countries);
  return total ? `${visitedCount}/${total}` : "";
}

/**
 * Gets the progress fraction for an achievement.
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
  const criteria = achievement.criteria || {};
  const regionCounts = regionProgressCounts(criteria, countries, visited);
  if (regionCounts)
    return regionCounts.required > 0
      ? Math.min(regionCounts.completed / regionCounts.required, 1)
      : 0;
  const visitedCount = getVisitedCount(achievement, countries, visited);
  const total = getTotalCount(achievement, countries);
  return total > 0 ? Math.min(visitedCount / total, 1) : 0;
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
 * @returns True if completed, false otherwise
 */
export function isCompleted(
  achievement: Achievement,
  countries: Country[],
  visited: { isCountryVisited: (iso: string) => boolean },
  trips?: Trip[],
  homeCountry?: string,
  achievementStatusMap?: Record<string, boolean>,
) {
  const criteria = achievement.criteria || {};
  // Check achievement dependencies first
  if (achievement.requires && achievementStatusMap) {
    if (!areRequirementsCompleted(achievement, achievementStatusMap))
      return false;
  }
  // Region-based: regions array
  const regionCounts = regionProgressCounts(criteria, countries, visited);
  if (regionCounts)
    return (
      regionCounts.completed >= regionCounts.required &&
      regionCounts.required > 0
    );
  // Trip-based: trip_countries_count (optionally with region)
  if (criteria.trip_countries_count && trips) {
    if (
      criteria.regions &&
      Array.isArray(criteria.regions) &&
      criteria.regions.length === 1
    ) {
      const regionCodes = countries
        .filter((c) => c.region === criteria.regions![0])
        .map((c) => c.isoCode);
      return hasTripAchievement(
        trips,
        regionCodes,
        criteria.trip_countries_count ?? 0,
      );
    } else {
      // Any trip with N+ countries
      return trips.some(
        (trip) =>
          new Set(trip.countryCodes).size >=
          (criteria.trip_countries_count ?? 0),
      );
    }
  }
  // Local trips
  if (criteria.local_trips_count && trips && homeCountry) {
    const completedLocalTrips = getCompletedTrips(
      getLocalTrips(trips, homeCountry),
    );
    return completedLocalTrips.length >= criteria.local_trips_count;
  }
  // Abroad trips (unique countries)
  if (criteria.abroad_countries_count && trips && homeCountry) {
    const abroadCountrySet = getUniqueAbroadCountries(trips, homeCountry);
    return abroadCountrySet.size >= criteria.abroad_countries_count;
  }
  // Abroad trips (number of trips)
  if (criteria.abroad_trips_count && trips && homeCountry) {
    const abroadTrips = getCompletedTrips(getAbroadTrips(trips, homeCountry));
    return abroadTrips.length >= criteria.abroad_trips_count;
  }
  // Repeat visits
  if (criteria.repeat_visits_count && trips) {
    const minVisits = criteria.repeat_min_visits || 2;
    let tripsToCheck = trips;
    if (criteria.only_abroad && homeCountry) {
      tripsToCheck = getAbroadTrips(trips, homeCountry);
    }
    const repeats = getRepeatVisitCount(tripsToCheck, minVisits);
    return repeats >= criteria.repeat_visits_count;
  }
  // Trip duration (longest trip in days)
  if (criteria.trip_duration_days && trips) {
    const completedTrips = getCompletedTrips(trips);
    const maxDuration =
      completedTrips.length > 0
        ? Math.max(...completedTrips.map((t) => getTripDays(t)))
        : 0;
    return maxDuration >= criteria.trip_duration_days;
  }
  // Default logic
  const visitedCount = getVisitedCount(achievement, countries, visited);
  const total = getTotalCount(achievement, countries);
  if (criteria.count) {
    return visitedCount >= (criteria.count as number);
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
  trips?: Trip[],
  homeCountry?: string,
): AchievementStatus {
  if (isCompleted(achievement, countries, visited, trips, homeCountry))
    return "completed";
  if (progressFraction(achievement, countries, visited) > 0) return "progress";
  return "locked";
}

/**
 * Merges achievements to show only relevant tiered achievements
 * @param achievements - List of all achievements
 * @param countries - List of all countries
 * @param visited - Visited countries utility
 * @param trips - Array of user trips
 * @param homeCountry - The user's home country
 * @returns Array of merged achievements
 */
export function getMergedAchievements(
  achievements: Achievement[],
  countries: Country[],
  visited: { isCountryVisited: (iso: string) => boolean },
  trips?: Trip[],
  homeCountry?: string,
) {
  const worldTiers: Achievement[] = [];
  const regionTiers: Record<string, Achievement[]> = {};
  const others: Achievement[] = [];
  for (const ach of achievements) {
    const criteria: Criteria = ach.criteria || {};
    const { tier, count, countries, regions } = criteria as Partial<Criteria>;

    // World achievement: has tier and count, but no regions/countries criteria
    if (tier && count && (!regions || regions.length === 0) && !countries) {
      worldTiers.push(ach);
      continue;
    }
    // Region achievement: has tier and a single region entry, but no countries criteria
    if (tier && Array.isArray(regions) && regions.length === 1) {
      const key = regions[0];
      regionTiers[key] ??= [];
      regionTiers[key].push(ach);
      continue;
    }

    others.push(ach);
  }

  let worldToShow: Achievement | null = null;
  if (worldTiers.length > 0) {
    const sorted = [...worldTiers].sort(
      (a, b) => (a.criteria?.tier ?? 0) - (b.criteria?.tier ?? 0),
    );
    worldToShow = sorted[0];
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (isCompleted(sorted[i], countries, visited, trips, homeCountry)) {
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
      (a, b) => (a.criteria?.tier ?? 0) - (b.criteria?.tier ?? 0),
    );
    let toShow = sorted[0];
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (isCompleted(sorted[i], countries, visited, trips, homeCountry)) {
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
    merged.push(toShow);
  });

  if (worldToShow) merged.push(worldToShow);
  merged.push(...others);
  return merged;
}

/**
 * Checks if any trip meets the criteria for a trip-based achievement.
 * @param trips - Array of user trips
 * @param regionCountryCodes - Array of country codes in the region
 * @param minCountries - Minimum number of countries in the region required in a single trip
 * @returns True if any trip meets the criteria
 */
export function hasTripAchievement(
  trips: Trip[],
  regionCountryCodes: string[],
  minCountries: number,
): boolean {
  return trips.some((trip) => {
    const visited = trip.countryCodes.filter((code) =>
      regionCountryCodes.includes(code),
    );
    return new Set(visited).size >= minCountries;
  });
}
