/**
 * Utility functions for filtering and processing achievements in the dashboard.
 */

import {
  applyQualifierSearch,
  type Country,
  type CountryFilterOptions,
} from "@features/countries";
import { parseComparator } from "@utils/number";
import type { Achievement, Criteria } from "../types";

// Set of non-selector keys that should be ignored when extracting selectors from criteria
const NON_SELECTOR_KEYS = new Set([
  "required",
  "count",
  "tier",
  "sovereign",
  "visited",
  "only_abroad",
]);

/** Builds filter parameters from achievement criteria. */
function buildFilterParamsFromCriteria(
  criteria: Criteria,
): CountryFilterOptions {
  const { sovereign } = criteria as unknown as { sovereign?: boolean };
  const selectedSovereignty = sovereign === false ? "" : ("sovereign" as const);
  const mods: Record<string, unknown> = {};
  const rawCount = (criteria as unknown as Record<string, unknown>)?.count;
  if (typeof rawCount !== "undefined" && rawCount !== null) {
    const parsed = parseComparator(String(rawCount), "\\d+");
    if (parsed) mods.count = parsed;
  }
  return { selectedSovereignty, modifiers: mods, search: "" };
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
  visitMaps?: {
    visitedIsoCodes?: string[];
    visitedMap?: Record<string, number>;
    visitedYearMap?: Record<string, Set<number>>;
  },
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
      visitMaps?.visitedIsoCodes,
      explicitFilterParams,
      explicit.map((c) => c.isoCode),
      visitMaps?.visitedMap,
      visitMaps?.visitedYearMap,
    );
  }

  // Find selectors and combine them with AND semantics
  const selectors = Object.entries(criteria || {}).filter(
    ([k, v]) => v != null && !NON_SELECTOR_KEYS.has(k),
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
          visitMaps?.visitedIsoCodes,
          filterParams,
          byQualifier.map((c) => c.isoCode),
          visitMaps?.visitedMap,
          visitMaps?.visitedYearMap,
        );
        for (const c of matched) thisQualIso.add(c.isoCode);
      }

      // Intersect with current set
      byQualifier = byQualifier.filter((c) => thisQualIso.has(c.isoCode));
      if (byQualifier.length === 0) break;
    }

    if (byQualifier.length > 0) return byQualifier;
  }

  // If no selectors and count-based, return the qualifier-filtered list
  if (criteria.required && selectors.length === 0) {
    return applyQualifierSearch(
      countries,
      "",
      visitMaps?.visitedIsoCodes,
      filterParams,
      countries.map((c) => c.isoCode),
      visitMaps?.visitedMap,
      visitMaps?.visitedYearMap,
    );
  }
  return [];
}
