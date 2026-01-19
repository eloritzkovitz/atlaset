/**
 * Utility functions for handling achievements in the dashboard.
 */

import type { Country } from "@features/countries";
import type { Trip } from "@features/trips";
import {
  getLocalTrips,
  getAbroadTrips,
  getCompletedTrips,
} from "@features/trips/utils/trips";
import { getVisitedCountriesUpToYear } from "@features/visits";
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
 * Gets the set of unique abroad countries visited in completed trips
 * @param trips - Array of user trips
 * @param homeCountry - The user's home country code
 * @returns Set of unique abroad country codes
 */
function getUniqueAbroadCountries(
  trips: Trip[],
  homeCountry: string,
): Set<string> {
  const abroadTrips = getCompletedTrips(getAbroadTrips(trips, homeCountry));
  return new Set(
    abroadTrips.flatMap((t) => t.countryCodes.filter((c) => c !== homeCountry)),
  );
}

/**
 * Gets the count of repeat visits across all trips
 * @param trips - Array of user trips
 * @returns Number of repeat visits
 */
function getRepeatVisitCount(trips: Trip[]): number {
  const visitCounts = getVisitedCountriesUpToYear(
    getCompletedTrips(trips),
    9999,
  );
  return Object.values(visitCounts).filter((count) => count > 1).length;
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
  trips?: Trip[],
  homeCountry?: string,
) {
  // Trip-based: trip_countries_count (optionally with region)
  if (achievement.criteria.trip_countries_count && trips) {
    if (achievement.criteria.region) {
      const regionCodes = countries
        .filter((c) => c.region === achievement.criteria.region)
        .map((c) => c.isoCode);
      const completed = hasTripAchievement(
        trips,
        regionCodes,
        achievement.criteria.trip_countries_count,
      );
      return completed ? `Trip completed` : `No qualifying trip yet`;
    } else {
      // Any trip with N+ countries
      const completed = trips.some(
        (trip) =>
          new Set(trip.countryCodes).size >=
          achievement.criteria.trip_countries_count,
      );
      return completed ? `Trip completed` : `No qualifying trip yet`;
    }
  }
  // Local trips
  if (achievement.criteria.local_trips_count && trips && homeCountry) {
    const completedLocalTrips = getCompletedTrips(
      getLocalTrips(trips, homeCountry),
    );
    return `${completedLocalTrips.length}/${achievement.criteria.local_trips_count}`;
  }
  // Abroad trips
  if (achievement.criteria.abroad_countries_count && trips && homeCountry) {
    const abroadCountrySet = getUniqueAbroadCountries(trips, homeCountry);
    return `${abroadCountrySet.size}/${achievement.criteria.abroad_countries_count}`;
  }
  // Repeat visits
  if (achievement.criteria.repeat_visits_count && trips) {
    const repeats = getRepeatVisitCount(trips);
    return `${repeats}/${achievement.criteria.repeat_visits_count}`;
  }
  // Custom count-based criteria
  if (
    (achievement.criteria.countries ||
      achievement.criteria.region ||
      achievement.criteria.subregion) &&
    achievement.criteria.count
  ) {
    const visitedCount = getVisitedCount(achievement, countries, visited);
    const count = achievement.criteria.count;
    return `${Math.min(visitedCount, count)}/${count}`;
  }
  // Default logic
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
  trips?: Trip[],
  homeCountry?: string,
) {
  // Trip-based: trip_countries_count (optionally with region)
  if (achievement.criteria.trip_countries_count && trips) {
    if (achievement.criteria.region) {
      const regionCodes = countries
        .filter((c) => c.region === achievement.criteria.region)
        .map((c) => c.isoCode);
      return hasTripAchievement(
        trips,
        regionCodes,
        achievement.criteria.trip_countries_count,
      );
    } else {
      // Any trip with N+ countries
      return trips.some(
        (trip) =>
          new Set(trip.countryCodes).size >=
          achievement.criteria.trip_countries_count,
      );
    }
  }
  // Local trips
  if (achievement.criteria.local_trips_count && trips && homeCountry) {
    const completedLocalTrips = getCompletedTrips(
      getLocalTrips(trips, homeCountry),
    );
    return completedLocalTrips.length >= achievement.criteria.local_trips_count;
  }
  // Abroad trips
  if (achievement.criteria.abroad_countries_count && trips && homeCountry) {
    const abroadCountrySet = getUniqueAbroadCountries(trips, homeCountry);
    return abroadCountrySet.size >= achievement.criteria.abroad_countries_count;
  }
  // Repeat visits
  if (achievement.criteria.repeat_visits_count && trips) {
    const repeats = getRepeatVisitCount(trips);
    return repeats >= achievement.criteria.repeat_visits_count;
  }
  // Default logic
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
  trips?: Trip[],
  homeCountry?: string,
): AchievementStatus {
  if (isCompleted(achievement, countries, visited, trips, homeCountry))
    return "completed";
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
      (a, b) => (a.criteria.tier || 0) - (b.criteria.tier || 0),
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
    merged.push(sorted[0]);
  });

  const result: Achievement[] = [];
  if (worldToShow) result.push(worldToShow);
  return [...result, ...merged, ...others];
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
