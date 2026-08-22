import { useMemo } from "react";
import type { Trip } from "@features/trips/types";
import {
  buildVisitedYearMap,
  computeVisitCountsFromYearMap,
} from "../utils/visits";
import { getVisitCountStats } from "../utils/visitStats";

const EMPTY_ARRAY: string[] = []; // Used to avoid unnecessary array allocations in useMemo dependencies

/**
 * Computes visit-related statistics and maps used by the country filters.
 * @param trips - The list of trips to analyze.
 * @param selectedYear - The currently selected year for filtering.
 * @param years - The list of all years in the timeline (optional, used for optimization).
 * @param isReadonly - Whether the map is in readonly mode (optional).
 * @param sharedVisitedIsoCodes - The list of visited ISO codes from shared map info (optional, used in readonly mode).
 * @param manualVisitedCountryCodes - The list of manually marked visited country codes (optional).
 * @returns An object containing the visited map, absolute min/max visit counts, and a visited year map.
 */
export function useVisitStats(
  trips: Trip[],
  selectedYear: number,
  years?: number[],
  isReadonly?: boolean,
  sharedVisitedIsoCodes?: string[] | undefined,
  manualVisitedCountryCodes: string[] = EMPTY_ARRAY,
) {
  const {
    map: visitedMap,
    min: absoluteMin,
    max: absoluteMax,
  } = useMemo(
    () => getVisitCountStats(trips, selectedYear),
    [trips, selectedYear],
  );

  // Build a per-country per-year presence map
  const visitedYearMap = useMemo(() => buildVisitedYearMap(trips), [trips]);

  // Optionally compute per-ISO visit counts up to the selected year
  const { visitCountByIsoCode, previouslyVisitedIsoCodes } = useMemo(() => {
    const counts = computeVisitCountsFromYearMap(
      visitedYearMap,
      selectedYear,
      years,
    );

    // Determine which countries were visited in any prior year.
    const prevSet = new Set<string>();
    const prior =
      years && years.length > 0
        ? new Set(years.filter((y) => y < selectedYear))
        : undefined;

    // Check if two sets intersect, optimized for the smaller set
    const intersectSets = (a: Set<number>, b: Set<number>) => {
      const [small, large] = a.size <= b.size ? [a, b] : [b, a];
      for (const v of small) if (large.has(v)) return true;
      return false;
    };

    // Iterate through the visitedYearMap to find countries with visits in prior years
    for (const [iso, yearSet] of Object.entries(visitedYearMap)) {
      if (!yearSet || yearSet.size === 0) continue;
      const priorMatch = prior
        ? intersectSets(yearSet, prior)
        : Array.from(yearSet).some((y) => y < selectedYear);
      if (priorMatch) prevSet.add(iso);
    }

    return { visitCountByIsoCode: counts, previouslyVisitedIsoCodes: prevSet };
  }, [visitedYearMap, selectedYear, years]);

  // Determine effective visited iso codes based on mode
  const visitedIsoCodes = useMemo(() => {
    if (isReadonly && sharedVisitedIsoCodes) return sharedVisitedIsoCodes;

    // Combine visited from trips and manually marked visited codes, ensuring uniqueness
    const combinedCodes = new Set([
      ...Object.keys(visitedMap),
      ...manualVisitedCountryCodes,
    ]);

    return Array.from(combinedCodes);
  }, [
    isReadonly,
    sharedVisitedIsoCodes,
    visitedMap,
    manualVisitedCountryCodes,
  ]);

  return {
    visitedMap,
    absoluteMin,
    absoluteMax,
    visitedYearMap,
    visitCountByIsoCode,
    previouslyVisitedIsoCodes,
    visitedIsoCodes,
  };
}
