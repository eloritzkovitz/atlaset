/**
 * Utility functions for filtering countries based on various criteria.
 */

import type { Layer } from "@features/atlas/layers";
import type { VisitContext } from "@features/visits";
import {
  getFirstYearFor,
  getLastYearFor,
  getVisitCountFor,
  hasVisitInYearFor,
  isVisitedFor,
} from "@features/visits/utils/visitHelpers";
import { filterBySearch } from "@utils/filter";
import { compareNumeric } from "@utils/number";
import { parseQualifierSearch } from "@utils/search";
import {
  buildSearchString,
  getQualifierTokens,
  resolveQualifierConfig,
} from "./countrySearch";
import { COUNTRY_RELATIONS } from "../constants/countryRelations";
import {
  ensureModifiers,
  type CountryModifiers,
} from "../constants/modifierConfig";
import { TRANSCONTINENTAL_MAP } from "../constants/transcontinental";
import type {
  Country,
  CountryFilterOptions,
  TranscontinentalScope,
} from "../types";

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
  const tcOption = options.transcontinental;

  const baseCountries = tcOption
    ? countries.filter((country) => {
        const entry = TRANSCONTINENTAL_MAP.get(
          country.isoCode?.toUpperCase?.() ?? "",
        );
        if (!entry) return false;
        if (tcOption === true) return true;
        const entryScope = entry.scope ?? "contiguous";
        return entryScope === tcOption;
      })
    : countries;

  // Apply filters
  return filterBySearch(baseCountries, search, (c) =>
    buildSearchString(c),
  ).filter((country) => {
    if (
      selectedRegion &&
      country.region !== selectedRegion &&
      !(
        getQualifierTokens(country, "region", {
          includeTC: includeTranscontinental,
        }) || []
      ).includes(selectedRegion)
    )
      return false;

    if (
      selectedSubregion &&
      country.subregion !== selectedSubregion &&
      !(
        getQualifierTokens(country, "subregion", {
          includeTC: includeTranscontinental,
        }) || []
      ).includes(selectedSubregion)
    )
      return false;

    if (selectedSovereignty && country.sovereigntyType !== selectedSovereignty)
      return false;

    if (
      layerCountries &&
      layerCountries.length &&
      !layerCountries.includes(country.isoCode)
    )
      return false;

    return true;
  });
}

// Parses a raw value for transcontinental scope, accepting booleans or specific strings
function parseTCScope(raw?: boolean | string): TranscontinentalScope {
  if (raw === true || raw === false) return raw;
  if (typeof raw === "string") {
    const v = raw.toLowerCase();
    if (v === "true") return true;
    if (v === "false") return false;
    if (v === "contiguous" || v === "overseas" || v === "other")
      return v as Exclude<TranscontinentalScope, boolean>;
  }
  return false;
}

/**
 * Filters countries by a qualifier and value, supporting arrays, strings and numbers.
 * @param countries - Array of Country objects.
 * @param qualifier - Qualifier name.
 * @param value - Value to match (case-insensitive, partial match).
 * @param visitContext - Optional context for visit-related qualifiers.
 * @param modifiers - Optional modifiers for special handling (e.g. transcontinental scope).
 * @returns Filtered array of Country objects matching the qualifier criteria.
 */
export function filterCountriesByQualifier(
  countries: Country[],
  qualifier: string,
  value: string,
  visitContext?: VisitContext,
  modifiers?: Record<string, boolean | string> | CountryModifiers,
): Country[] {
  const config = resolveQualifierConfig(qualifier);
  if (!config?.key) return [];

  const key = config.key;
  const mods = ensureModifiers(modifiers);
  const includeTC: TranscontinentalScope = parseTCScope(mods.tc);
  const searchValue = value.toLowerCase();
  const vmap = visitContext?.visitedMap;
  const ymap = visitContext?.visitedYearMap;
  const visitedIso = visitContext?.visitedIsoCodes ?? [];
  const firstVisitMap = visitContext?.firstVisitMap;
  const lastVisitMap = visitContext?.lastVisitMap;
  const parsedCount = mods.count;
  const parsedYear = mods.year;
  const parsedFirst = mods.first;
  const parsedLast = mods.last;

  // Handle sovereigntyType with "of" modifier for related countries
  if (key === "sovereigntyType") {
    const ofIso = mods?.of ? String(mods.of).toUpperCase() : undefined;
    if (ofIso) {
      const sovereignEntry = COUNTRY_RELATIONS[ofIso];
      const deps = [
        ...(sovereignEntry?.dependencies ?? []),
        ...(sovereignEntry?.regions ?? []),
      ];
      const search = searchValue;
      return countries.filter((c) => {
        if (!deps.includes(c.isoCode)) return false;
        if (!search) return true;
        return (c.sovereigntyType ?? "").toLowerCase().includes(search);
      });
    }

    // Fallback: match sovereignty type string
    return countries.filter((country) =>
      (country.sovereigntyType ?? "").toLowerCase().includes(searchValue),
    );
  }

  // Handle visit-related qualifiers with visit context and modifiers
  const visitedMod = mods?.visited;
  return countries.filter((country) => {
    if (typeof visitedMod !== "undefined") {
      const visited = isVisitedFor(country.isoCode, vmap, visitedIso);
      if (visitedMod === true && !visited) return false;
      if (visitedMod === false && visited) return false;
    }

    // If `count:` modifier is present, check the visit count against the condition
    if (parsedCount) {
      const count = getVisitCountFor(country.isoCode, vmap, visitedIso);
      if (!compareNumeric(parsedCount.op, count, parsedCount.value))
        return false;
    }

    // If `year:` modifier is present, apply it as an additional filter
    if (parsedYear) {
      const { op, year } = parsedYear;
      if (op === "=") {
        if (!hasVisitInYearFor(country.isoCode, year, ymap)) return false;
      } else {
        const firstYear = getFirstYearFor(country.isoCode, firstVisitMap, ymap);
        if (firstYear === null) return false;
        if (!compareNumeric(op, firstYear, year)) return false;
      }
    }

    // If `first:` modifier is present, apply it against the first visit year
    if (parsedFirst) {
      const { op, year } = parsedFirst;
      const firstYear = getFirstYearFor(country.isoCode, firstVisitMap, ymap);
      if (firstYear === null) return false;
      if (!compareNumeric(op, firstYear, year)) return false;
    }

    // If `last:` modifier is present, apply it against the last visit year
    if (parsedLast) {
      const { op, year } = parsedLast;
      const lastYear = getLastYearFor(country.isoCode, lastVisitMap, ymap);
      if (lastYear === null) return false;
      if (!compareNumeric(op, lastYear, year)) return false;
    }

    return getQualifierTokens(country, key, {
      includeTC,
      visitContext,
    }).some(
      (t) => typeof t === "string" && t.toLowerCase().includes(searchValue),
    );
  });
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
 * Apply qualifier-based search or normal search with layer filtering.
 * @param countries - List of countries to filter.
 * @param search - The search string, which may include qualifier-based search (e.g. "region:Europe").
 * @param visitedIsoCodes - List of visited country ISO codes for visit-based qualifier searches.
 * @param filterParams - The current filter parameters to apply for normal search.
 * @param filteredIsoCodes - The list of ISO codes filtered by layers, to be applied for normal search.
 * @param visitedMap - Optional map of visit counts for visit-based qualifier searches.
 * @param visitedYearMap - Optional map of visit years for visit-based qualifier searches.
 * @returns The list of countries filtered based on the search criteria.
 */
export function applyQualifierSearch(
  countries: Country[],
  search: string,
  visitedIsoCodes: string[] | undefined,
  filterParams: CountryFilterOptions,
  filteredIsoCodes: string[] | undefined,
  visitedMap?: Record<string, number>,
  visitedYearMap?: Record<string, Set<number>>,
) {
  const parsed = parseQualifierSearch(search);
  if (parsed && (parsed.query ?? "").trim() !== "") {
    const visitContext: VisitContext | undefined =
      visitedIsoCodes || visitedMap || visitedYearMap
        ? {
            visitedIsoCodes: visitedIsoCodes ?? [],
            visitedMap: visitedMap ?? {},
            visitedYearMap: visitedYearMap ?? {},
          }
        : undefined;
    return filterCountriesByQualifier(
      countries,
      parsed.qualifier,
      parsed.query,
      visitContext,
      parsed.modifiers ?? {},
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
