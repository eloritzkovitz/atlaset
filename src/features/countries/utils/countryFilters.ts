/**
 * Utility functions for filtering countries based on various criteria.
 */

import type { Layer } from "@features/atlas/layers/types";
import type { VisitContext } from "@features/visits/types";
import {
  compareNumeric,
  filterBySearch,
  matchesToken,
  parseComparator,
  parseQualifierSearch,
} from "@utils";
import {
  applyModifiersToCountry,
  ensureModifiers,
  matchesTranscontinental,
  parseTCOption,
} from "./countryModifiers";
import {
  buildSearchString,
  getQualifierTokens,
  resolveQualifierConfig,
} from "./countrySearch";
import { MODIFIER_MAP } from "../constants/modifierConfig";
import type { Country, CountryFilterOptions, CountryModifiers } from "../types";

/**
 * Builds a VisitContext object from the provided parameters.
 * @param visitedIsoCodes - Optional array of visited country ISO codes.
 * @param visitedMap - Optional map of visited country ISO codes to visit counts.
 * @param visitedYearMap - Optional map of visited country ISO codes to sets of visit years.
 * @returns A VisitContext object or undefined if no parameters are provided.
 */
function buildVisitContextFromParams(
  visitedIsoCodes?: string[] | undefined,
  visitedMap?: Record<string, number> | undefined,
  visitedYearMap?: Record<string, Set<number>> | undefined,
  wantToVisitCodes?: string[] | undefined,
) {
  if (!visitedIsoCodes && !visitedMap && !visitedYearMap && !wantToVisitCodes) {
    return undefined;
  }

  const iso =
    typeof visitedIsoCodes !== "undefined"
      ? visitedIsoCodes
      : visitedMap
        ? Object.keys(visitedMap)
        : [];

  return {
    visitedIsoCodes: iso,
    visitedMap: typeof visitedMap !== "undefined" ? visitedMap : undefined,
    visitedYearMap:
      typeof visitedYearMap !== "undefined" ? visitedYearMap : undefined,
    wantToVisitIsoCodes:
      typeof wantToVisitCodes !== "undefined" ? wantToVisitCodes : undefined,
  } as VisitContext;
}

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
  visitContext?: VisitContext,
) {
  const {
    search = "",
    selectedRegion,
    selectedSubregion,
    selectedGeoType,
    selectedSovereignty,
    layerCountries,
  } = options;

  const mods = (options.modifiers ?? {}) as CountryModifiers;

  // Parse transcontinental option from modifiers
  const tcParsed = parseTCOption(mods.tc);
  const tcScope = tcParsed.scope;
  const tcMode = tcParsed.mode;

  // If mode is "only" restrict the base set to transcontinental matches
  const baseCountries =
    tcMode === "only"
      ? countries.filter((country) => matchesTranscontinental(country, tcScope))
      : countries;

  // Apply filters
  return filterBySearch(baseCountries, search, (c) =>
    buildSearchString(c),
  ).filter((country) => {
    if (
      selectedRegion &&
      (country as unknown as Record<string, unknown>).regionKey !==
        selectedRegion &&
      !(
        getQualifierTokens(country, "region", {
          tcOption: tcParsed,
        }) || []
      ).includes(selectedRegion)
    )
      return false;

    if (
      selectedSubregion &&
      (country as unknown as Record<string, unknown>).subregionKey !==
        selectedSubregion &&
      !(
        getQualifierTokens(country, "subregion", {
          tcOption: tcParsed,
        }) || []
      ).includes(selectedSubregion)
    )
      return false;

    if (
      selectedSovereignty &&
      country.sovereigntyStatus !== selectedSovereignty
    )
      return false;

    if (selectedGeoType && country.geoType !== selectedGeoType) return false;

    if (
      layerCountries &&
      layerCountries.length &&
      !layerCountries.includes(country.isoCode)
    )
      return false;

    // Apply global modifiers if present
    if (!applyModifiersToCountry(country, mods, visitContext)) return false;

    return true;
  });
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
  modifiers?: CountryModifiers,
): Country[] {
  const config = resolveQualifierConfig(qualifier);
  if (!config?.key) return [];

  const key = config.key;
  const mods = (modifiers ?? {}) as CountryModifiers;
  const tcOption = parseTCOption(mods.tc);
  const searchValue = value.toLowerCase();

  // Handle numeric comparison for number type qualifiers
  if (key === "area" || key === "population") {
    const comp = parseComparator(String(value).replace(/,/g, ""));
    if (comp) {
      return countries.filter((country) => {
        const raw = (country as Record<string, unknown>)[key];
        if (raw === undefined || raw === null) return false;
        const n = Number(String(raw).replace(/,/g, ""));
        if (Number.isNaN(n)) return false;
        return compareNumeric(comp.op, n, comp.value);
      });
    }
  }

  // Handle sovereignty status
  if (key === "sovereigntyStatus") {
    return countries.filter((country) =>
      (country.sovereigntyStatus ?? "").toLowerCase().includes(searchValue),
    );
  }

  // Handle visit-related qualifiers with visit context and modifiers
  return countries.filter((country) => {
    if (!applyModifiersToCountry(country, mods, visitContext)) return false;
    return getQualifierTokens(country, key, {
      tcOption,
      dst: mods.dst,
      visitContext,
    }).some((t) => {
      if (typeof t !== "string") return false;
      return matchesToken(t, searchValue, { match: mods.match });
    });
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
 * @param visitedIsoCodes - List of visited country ISO codes.
 * @param wantToVisitIsoCodes - List of want-to-visit country ISO codes.
 * @returns An object containing counts of various country categories.
 */
export function getCountryCounts({
  filteredCountries,
  visitedIsoCodes,
  wantToVisitIsoCodes,
}: {
  filteredCountries: Country[];
  visitedIsoCodes: string[];
  wantToVisitIsoCodes: string[];
}) {
  const allCount = filteredCountries.length;
  const sovereignCount = filteredCountries.filter(
    (c) => c.sovereigntyStatus === "sovereign",
  ).length;
  const visitedCount = filteredCountries.filter((c) =>
    visitedIsoCodes.includes(c.isoCode),
  ).length;
  const wantToVisitCount = filteredCountries.filter((c) =>
    wantToVisitIsoCodes.includes(c.isoCode),
  ).length;
  return {
    allCount,
    sovereignCount,
    visitedCount,
    wantToVisitCount,
  };
}

/**
 * Returns a filter function for sovereignty based on the criteria.
 * @param sovereignOnly - If true, only matches countries with sovereigntyStatus "Sovereign".
 */
export function createSovereigntyFilter(sovereignOnly?: boolean) {
  return (c: Country) =>
    sovereignOnly ? c.sovereigntyStatus === "sovereign" : true;
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
 * @param wantToVisitCodes - Optional list of want-to-visit country ISO codes for visit-based qualifier searches.
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
  wantToVisitCodes?: string[] | undefined,
) {
  const parsed = parseQualifierSearch(search);
  const visitContext = buildVisitContextFromParams(
    visitedIsoCodes,
    visitedMap,
    visitedYearMap,
    wantToVisitCodes,
  );
  if (parsed && (parsed.query ?? "").trim() !== "") {
    // Normalize parsed modifiers into typed structure
    const rawMods = parsed.modifiers ?? {};
    const parsedMods = ensureModifiers(parsed.modifiers);

    // Apply primary qualifier filter
    let byQualifier = filterCountriesByQualifier(
      countries,
      parsed.qualifier,
      parsed.query,
      visitContext,
      parsedMods,
    );

    // Apply any additional modifiers that weren't handled by ensureModifiers
    for (const [rawKey, rawVal] of Object.entries(rawMods)) {
      const key = rawKey.toLowerCase();
      if (key === parsed.qualifier.toLowerCase()) continue;
      // Skip known modifiers handled elsewhere
      if (Object.prototype.hasOwnProperty.call(MODIFIER_MAP, key)) continue;

      const qConf = resolveQualifierConfig(key);
      if (!qConf) continue;
      const valStr =
        typeof rawVal === "boolean" ? String(rawVal) : String(rawVal ?? "");
      if (valStr.trim() === "") continue;
      byQualifier = filterCountriesByQualifier(
        byQualifier,
        key,
        valStr,
        visitContext,
        parsedMods,
      );
    }

    // Merge parsed modifiers into the existing filter params so they apply globally
    const mergedModifiers = {
      ...(filterParams.modifiers as CountryModifiers | undefined),
      ...(parsedMods ?? {}),
    } as CountryModifiers;

    const mergedParams: CountryFilterOptions = {
      ...filterParams,
      modifiers: mergedModifiers,
      search: "",
      layerCountries: filteredIsoCodes,
    };

    return filterCountries(byQualifier, mergedParams, visitContext);
  }

  // If search contains a colon but didn't parse, treat it as normal search
  if (typeof search === "string" && search.includes(":")) {
    const parts = search.split(":");
    const after = parts.slice(1).join(":").trim();
    if (after === "") {
      return filterCountries(
        countries,
        {
          ...filterParams,
          search: "",
          layerCountries: filteredIsoCodes,
        },
        visitContext,
      );
    }
  }

  return filterCountries(
    countries,
    {
      ...filterParams,
      layerCountries: filteredIsoCodes,
    },
    visitContext,
  );
}
