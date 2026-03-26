/**
 * Utility functions for filtering countries based on various criteria.
 */

import type { Layer } from "@features/atlas/layers";
import type { VisitContext } from "@features/visits";
import { filterBySearch } from "@utils/filter";
import {
  compareNumeric,
  parseComparator,
  parseYearComparator,
} from "@utils/number";
import {
  buildSearchString,
  getPropertyTokens,
  resolvePropertyConfig,
  parsePropertySearch,
} from "./countrySearch";
import type { Country, CountryFilterOptions } from "../types";

/**
 * Filters countries based on various criteria.
 * @param countries - The list of countries to filter.
 * @param options - Filtering options for countries.
 * @returns Filtered list of countries.
 * @see CountryFilterOptions
 */
export function filterCountries(
  countries: Country[],
  options: CountryFilterOptions,
) {
  const {
    search = "",
    selectedRegion,
    selectedSubregion,
    selectedSovereignty,
    layerCountries,
  } = options;

  // Determine if transcontinental countries should be included
  const includeTranscontinental = options.includeTranscontinental === true;

  // Apply filters
  return filterBySearch(countries, search, (c) => buildSearchString(c)).filter(
    (country) => {
      if (
        selectedRegion &&
        country.region !== selectedRegion &&
        !(
          getPropertyTokens(country, "region", {
            includeTC: includeTranscontinental,
          }) || []
        ).includes(selectedRegion)
      )
        return false;

      if (
        selectedSubregion &&
        country.subregion !== selectedSubregion &&
        !(
          getPropertyTokens(country, "subregion", {
            includeTC: includeTranscontinental,
          }) || []
        ).includes(selectedSubregion)
      )
        return false;

      if (
        selectedSovereignty &&
        country.sovereigntyType !== selectedSovereignty
      )
        return false;

      if (
        layerCountries &&
        layerCountries.length &&
        !layerCountries.includes(country.isoCode)
      )
        return false;

      return true;
    },
  );
}

/**
 * Filters countries by a property and value, supporting arrays and strings.
 * @param countries - Array of Country objects.
 * @param property - Property name.
 * @param value - Value to match (case-insensitive, partial match).
 */
export function filterCountriesByProperty(
  countries: Country[],
  property: string,
  value: string,
  visitContext?: VisitContext,
): Country[] {
  const config = resolvePropertyConfig(property);
  if (!config?.key) return [];

  const key = config.key;
  const includeTC = !!config.includeTC;
  const searchValue = value.toLowerCase();
  const vmap = visitContext?.visitedMap ?? {};
  const ymap = visitContext?.visitedYearMap ?? {};
  const visitedIso = visitContext?.visitedIsoCodes ?? [];

  switch (key) {
    case "visits": {
      const parsed = parseComparator(value, "\\d+");
      if (!parsed) return [];
      const { op, value: num } = parsed;
      return countries.filter((country) => {
        const isVisited = visitedIso.includes(country.isoCode);
        const queryIsZero =
          (op === "=" && num === 0) || (op === "<" && num === 1);
        if (!queryIsZero && num > 0 && !isVisited) return false;
        const count = vmap[country.isoCode] || 0;
        return compareNumeric(op, count, num);
      });
    }

    case "firstVisit": {
      const parsed = parseYearComparator(value);
      if (!parsed) return [];
      const { op, year } = parsed;
      return countries.filter((country) => {
        // Prefer precise date map, otherwise derive from year map
        const firstDate = visitContext?.firstVisitMap?.[country.isoCode];
        const yearsForFirst = ymap[country.isoCode];
        const firstYear = firstDate
          ? firstDate.getFullYear()
          : yearsForFirst && yearsForFirst.size > 0
            ? Math.min(...Array.from(yearsForFirst))
            : null;
        if (firstYear === null) return false;
        return compareNumeric(op, firstYear, year);
      });
    }

    case "lastVisit": {
      const parsed = parseYearComparator(value);
      if (!parsed) return [];
      const { op, year } = parsed;
      return countries.filter((country) => {
        const lastDate = visitContext?.lastVisitMap?.[country.isoCode];
        const yearsForLast = ymap[country.isoCode];
        const lastYear = lastDate
          ? lastDate.getFullYear()
          : yearsForLast && yearsForLast.size > 0
            ? Math.max(...Array.from(yearsForLast))
            : null;
        if (lastYear === null) return false;
        return compareNumeric(op, lastYear, year);
      });
    }

    case "visitYear": {
      const parsed = parseYearComparator(value);
      if (!parsed) return [];
      const { op, year } = parsed;
      if (op === "=") {
        return countries.filter((country) =>
          Boolean(ymap[country.isoCode]?.has(year)),
        );
      }
      return countries.filter((country) => {
        const firstDate = visitContext?.firstVisitMap?.[country.isoCode];
        const yearsForFirst2 = ymap[country.isoCode];
        const firstYear = firstDate
          ? firstDate.getFullYear()
          : yearsForFirst2 && yearsForFirst2.size > 0
            ? Math.min(...Array.from(yearsForFirst2))
            : null;
        if (firstYear === null) return false;
        return compareNumeric(op, firstYear, year);
      });
    }

    default:
      return countries.filter((country) =>
        getPropertyTokens(country, key, { includeTC, visitContext }).some(
          (t: string) =>
            typeof t === "string" && t.toLowerCase().includes(searchValue),
        ),
      );
  }
}

/**
 * Filters ISO codes based on layer selections.
 * @param countries - List of all countries.
 * @param layers - List of all layers.
 * @param layerSelections - Current layer selections.
 * @returns Filtered list of ISO codes.
 */
export function getFilteredIsoCodes(
  countries: Country[],
  layers: Layer[],
  layerSelections: Record<string, string>,
) {
  const base = countries.map((c) => c.isoCode);

  return layers.reduce((accIsoCodes, layer) => {
    const selection = layerSelections[layer.id] || "all";
    if (selection === "only") {
      return accIsoCodes.filter((iso) => layer.countries.includes(iso));
    }
    if (selection === "exclude") {
      return accIsoCodes.filter((iso) => !layer.countries.includes(iso));
    }
    return accIsoCodes; // "all"
  }, base as string[]);
}

/**
 * Calculates country counts based on filtered countries and visited ISO codes.
 * @param filteredCountries - Countries after applying all filters including layers.
 * @param filteredCountriesNoLayer - Countries after applying all filters except layers.
 * @param visitedIsoCodes - List of visited country ISO codes.
 * @returns An object containing counts of various country categories.
 */
export function getCountryCounts({
  filteredCountries,
  filteredCountriesNoLayer,
  visitedIsoCodes,
}: {
  filteredCountries: Country[];
  filteredCountriesNoLayer: Country[];
  visitedIsoCodes: string[];
}) {
  const allCount = filteredCountries.length;
  const allCountWithoutLayers = filteredCountriesNoLayer.length;
  const sovereignCount = filteredCountries.filter(
    (c) => c.sovereigntyType === "Sovereign",
  ).length;
  const visitedCount = filteredCountries.filter((c) =>
    visitedIsoCodes.includes(c.isoCode),
  ).length;
  return {
    allCount,
    allCountWithoutLayers,
    sovereignCount,
    visitedCount,
  };
}

/**
 * Returns a filter function for sovereignty based on the criteria.
 * @param sovereignOnly - If true, only matches countries with sovereigntyType "Sovereign".
 */
export function createSovereigntyFilter(sovereignOnly?: boolean) {
  return (c: Country) =>
    sovereignOnly ? c.sovereigntyType === "Sovereign" : true;
}

/**
 * Apply property-based search or normal search with layer filtering.
 * @param countries - List of countries to filter.
 * @param search - The search string, which may include property-based search (e.g. "region:Europe").
 * @param visitedIsoCodes - List of visited country ISO codes for visit-based property searches.
 * @param filterParams - The current filter parameters to apply for normal search.
 * @param filteredIsoCodes - The list of ISO codes filtered by layers, to be applied for normal search.
 * @param visitedMap - Optional map of visit counts for visit-based property searches.
 * @param visitedYearMap - Optional map of visit years for visit-based property searches.
 * @returns The list of countries filtered based on the search criteria.
 */
export function applyPropertySearch(
  countries: Country[],
  search: string,
  visitedIsoCodes: string[] | undefined,
  filterParams: CountryFilterOptions,
  filteredIsoCodes: string[] | undefined,
  visitedMap?: Record<string, number>,
  visitedYearMap?: Record<string, Set<number>>,
) {
  const parsed = parsePropertySearch(search);
  if (parsed) {
    const visitContext: VisitContext | undefined =
      visitedIsoCodes || visitedMap || visitedYearMap
        ? {
            visitedIsoCodes: visitedIsoCodes ?? [],
            visitedMap: visitedMap ?? {},
            visitedYearMap: visitedYearMap ?? {},
          }
        : undefined;
    return filterCountriesByProperty(
      countries,
      parsed.property,
      parsed.query,
      visitContext,
    );
  }
  // If search contains a colon but didn't parse, treat it as normal search
  if (typeof search === "string" && search.includes(":")) {
    const parts = search.split(":");
    const after = parts.slice(1).join(":").trim();
    if (after === "") {
      return filterCountries(countries, {
        ...filterParams,
        search: "",
        layerCountries: filteredIsoCodes,
      });
    }
  }
  return filterCountries(countries, {
    ...filterParams,
    layerCountries: filteredIsoCodes,
  });
}
