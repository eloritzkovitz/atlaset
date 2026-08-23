/**
 * Utility functions for calculating achievement progress based on criteria.
 */

import type { Country } from "@features/countries/types";
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
import type { Achievement, Criteria } from "../types";

/**
 * Get the count of visited countries for the achievement.
 * @param achievement - The achievement object.
 * @param countries - List of all countries.
 * @param isVisitedCountry - Function to check if a country is visited.
 * @returns Number of visited countries relevant to the achievement.
 */
export function getVisitedCount(
  achievement: Achievement,
  countries: Country[],
  isVisitedCountry: (isoCode: string) => boolean,
  tierCount?: number,
  trips?: Trip[],
  homeCountry?: string,
) {
  const visitCtx = buildVisitContext(trips ?? [], undefined, homeCountry);

  const achievementCountries = getAchievementCountries(achievement, countries, {
    visitedIsoCodes: visitCtx.visitedIsoCodes,
    visitedMap: visitCtx.visitedMap,
    visitedYearMap: visitCtx.visitedYearMap,
  });

  const criteria: Criteria = achievement.criteria || {};

  const filteredCountries =
    criteria.only_abroad && homeCountry
      ? achievementCountries.filter(
          (country) => country.isoCode !== homeCountry,
        )
      : achievementCountries;

  const countriesToCount =
    typeof tierCount === "number"
      ? filteredCountries.slice(0, tierCount)
      : filteredCountries;

  return countriesToCount.filter((country) => isVisitedCountry(country.isoCode))
    .length;
}

/**
 * Get the total count of countries for the achievement.
 * @param achievement - The achievement object.
 * @param countries - List of all countries.
 * @returns Total number of countries relevant to the achievement.
 */
export function getTotalCount(
  achievement: Achievement,
  countries: Country[],
  tierCount?: number,
) {
  if (achievement.countries && typeof tierCount === "number") {
    return Math.min(achievement.countries.length, tierCount);
  }

  const criteria = achievement.criteria || {};

  if (criteria.countries) {
    return criteria.countries.length;
  }

  if (criteria.required) {
    return criteria.required;
  }

  return getAchievementCountries(achievement, countries).length;
}

/**
 * Gets the progress counts for region-based achievements.
 * @param criteria - The achievement criteria
 * @param countries - List of all countries
 * @param isVisitedCountry - Function to check if a country is visited
 * @returns - Object containing completed and required counts, or null if not region-based
 */
export function getRegionProgressCounts(
  criteria: Criteria,
  countries: Country[],
  isVisitedCountry: (isoCode: string) => boolean,
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
      c.region === region ? isVisitedCountry(c.isoCode) : false,
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
 * @param isVisitedCountry - Function to check if a country is visited.
 * @param trips - Optional array of user trips.
 * @param homeCountry - Optional home country ISO code.
 * @returns Object containing current and total counts for the achievement progress.
 */
export function getProgressMetrics(
  achievement: Achievement,
  countries: Country[],
  isVisitedCountry: (isoCode: string) => boolean,
  trips?: Trip[],
  homeCountry?: string,
) {
  const criteria = achievement.criteria || {};

  // Region-based achievements
  const regionCounts = getRegionProgressCounts(
    criteria,
    countries,
    isVisitedCountry,
  );

  if (regionCounts) {
    return {
      current: regionCounts.completed,
      total: regionCounts.required,
    };
  }

  // Trip-based achievements
  if (trips) {
    if (criteria.trip_countries_count) {
      const requiredCountries = criteria.trip_countries_count;

      if (criteria.regions?.length === 1) {
        const regionCodes = new Set(
          countries
            .filter((country) => country.region === criteria.regions![0])
            .map((country) => country.isoCode),
        );

        const maxRegionCount = Math.max(
          0,
          ...trips.map(
            (trip) =>
              trip.countryCodes.filter((code) => regionCodes.has(code)).length,
          ),
        );

        return {
          current: maxRegionCount,
          total: requiredCountries,
        };
      }

      const maxTripCountryCount = Math.max(
        0,
        ...trips.map((trip) => new Set(trip.countryCodes).size),
      );

      return {
        current: maxTripCountryCount,
        total: requiredCountries,
      };
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
      const completedTrips = getCompletedTrips(trips);

      const maxDays =
        completedTrips.length > 0
          ? Math.max(...completedTrips.map((trip) => getTripDays(trip)))
          : 0;

      return {
        current: maxDays,
        total: criteria.trip_duration_days,
      };
    }
  }

  // Default visited-country progress
  const visitedCount = getVisitedCount(
    achievement,
    countries,
    isVisitedCountry,
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
 * @param achievement - The achievement object.
 * @param countries - List of all countries.
 * @param isVisitedCountry - Function to check if a country is visited.
 * @returns Progress string in the format "visited/total".
 */
export function getProgress(
  achievement: Achievement,
  countries: Country[],
  isVisitedCountry: (isoCode: string) => boolean,
  trips?: Trip[],
  homeCountry?: string,
  achievementStatusMap?: Record<string, boolean>,
  showPercent = false,
) {
  const criteria = achievement.criteria || {};

  // Dependency-only achievements
  if (
    achievement.requires?.length &&
    Object.keys(criteria).length === 0 &&
    achievementStatusMap
  ) {
    const completedCount = achievement.requires.filter(
      (reqId) => achievementStatusMap[reqId],
    ).length;

    return formatFraction(completedCount, achievement.requires.length, {
      showPercent,
    });
  }

  // Trip achievements don't have a country-style progress label.
  if (achievement.type === "trips") {
    return "";
  }

  const { current, total } = getProgressMetrics(
    achievement,
    countries,
    isVisitedCountry,
    trips,
    homeCountry,
  );

  if (!total) {
    return "";
  }

  return formatFraction(current, total, {
    showPercent,
  });
}

/**
 * Gets the progress fraction for an achievement.
 * @param achievement - The achievement object.
 * @param countries - List of all countries.
 * @param isVisitedCountry - Function to check if a country is visited.
 * @returns Progress fraction between 0 and 1.
 */
export function getProgressFraction(
  achievement: Achievement,
  countries: Country[],
  isVisitedCountry: (isoCode: string) => boolean,
  trips?: Trip[],
  homeCountry?: string,
) {
  const { current, total } = getProgressMetrics(
    achievement,
    countries,
    isVisitedCountry,
    trips,
    homeCountry,
  );
  return total > 0 ? Math.min(current / total, 1) : 0;
}
