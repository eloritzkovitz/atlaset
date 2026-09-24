/**
 * Utility functions for applying search expressions and qualifiers to country collections.
 */

import type { VisitContext } from "@features/visits/types";
import type { ParsedSearchEntry, SearchExpression } from "@types";
import {
  compareNumeric,
  matchesToken,
  parseComparator,
  parseSearchQuery,
} from "@utils";
import { ensureModifiers } from "./countryModifiers";
import { getQualifierTokens } from "./countryQualifiers";
import { resolveQualifierConfig } from "./countrySearch";
import { matchesTranscontinental, parseTCOption } from "./transcontinental";
import { MODIFIER_MAP } from "../constants/modifierConfig";
import type { CountryFilterOptions, CountryQualifierOptions } from "../types";
import type { Country } from "../../types";
import { filterCountries } from "./countryFilters";

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
 * Filters countries by a qualifier and value.
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
  modifiers?: CountryQualifierOptions,
): Country[] {
  const config = resolveQualifierConfig(qualifier);

  if (!config?.key) {
    return [];
  }

  const key = config.key;
  const mods = modifiers ?? {};
  const searchValue = value.toLowerCase();

  if (key === "tc") {
    const tcOption = parseTCOption(value);

    return countries.filter((country) =>
      matchesTranscontinental(country, tcOption.scope),
    );
  }

  if (key === "area" || key === "population") {
    const comparator = parseComparator(String(value).replace(/,/g, ""));

    if (!comparator) {
      return [];
    }

    return countries.filter((country) => {
      const raw = (country as Record<string, unknown>)[key];

      if (raw === undefined || raw === null) {
        return false;
      }

      const number = Number(String(raw).replace(/,/g, ""));

      if (Number.isNaN(number)) {
        return false;
      }

      return compareNumeric(comparator.op, number, comparator.value);
    });
  }

  if (key === "sovereigntyStatus") {
    return countries.filter((country) =>
      (country.sovereigntyStatus ?? "").toLowerCase().includes(searchValue),
    );
  }

  return countries.filter((country) =>
    getQualifierTokens(country, key, {
      tcOption: mods.tcOption,
      dst: mods.dst,
      visitContext,
    }).some(
      (token) =>
        typeof token === "string" &&
        matchesToken(token, searchValue, {
          match: mods.match,
        }),
    ),
  );
}

/** Checks whether a parsed search entry is a modifier. */
function isModifierEntry(entry: ParsedSearchEntry): boolean {
  return Object.prototype.hasOwnProperty.call(MODIFIER_MAP, entry.key);
}

/** Checks whether a parsed search entry is a supported country qualifier. */
function isQualifierEntry(entry: ParsedSearchEntry): boolean {
  return !isModifierEntry(entry) && Boolean(resolveQualifierConfig(entry.key));
}

interface SearchMetadata {
  modifiers: ParsedSearchEntry[];
  hasQualifier: boolean;
  tcEntry?: ParsedSearchEntry;
}

/** Collects search metadata from the parsed expression. */
function collectSearchMetadata(expression: SearchExpression): SearchMetadata {
  switch (expression.type) {
    case "condition":
      if (isModifierEntry(expression.entry)) {
        return {
          modifiers: [expression.entry],
          hasQualifier: false,
        };
      }

      if (isQualifierEntry(expression.entry)) {
        return {
          modifiers: [],
          hasQualifier: true,
          tcEntry: expression.entry.key === "tc" ? expression.entry : undefined,
        };
      }

      return {
        modifiers: [],
        hasQualifier: false,
      };

    case "and":
    case "or": {
      const left = collectSearchMetadata(expression.left);
      const right = collectSearchMetadata(expression.right);

      return {
        modifiers: [...left.modifiers, ...right.modifiers],
        hasQualifier: left.hasQualifier || right.hasQualifier,
        tcEntry: left.tcEntry ?? right.tcEntry,
      };
    }

    case "not":
      return collectSearchMetadata(expression.expression);
  }
}

/** Evaluates a parsed search expression against a country collection. */
function evaluateSearchExpression(
  expression: SearchExpression,
  countries: Country[],
  visitContext: VisitContext | undefined,
  qualifierOptions: CountryQualifierOptions,
): Country[] {
  switch (expression.type) {
    case "condition": {
      if (!isQualifierEntry(expression.entry)) {
        return countries;
      }

      const { key, value } = expression.entry;

      if (key === "tc") {
        const tcOption = parseTCOption(String(value));

        if (tcOption.mode === "include") {
          return countries;
        }

        if (tcOption.mode === "exclude") {
          return countries.filter(
            (country) => !matchesTranscontinental(country, tcOption.scope),
          );
        }
      }

      return filterCountriesByQualifier(
        countries,
        key,
        String(value),
        visitContext,
        qualifierOptions,
      );
    }

    case "and": {
      const leftCountries = evaluateSearchExpression(
        expression.left,
        countries,
        visitContext,
        qualifierOptions,
      );

      return evaluateSearchExpression(
        expression.right,
        leftCountries,
        visitContext,
        qualifierOptions,
      );
    }

    case "or": {
      const leftCountries = evaluateSearchExpression(
        expression.left,
        countries,
        visitContext,
        qualifierOptions,
      );

      const rightCountries = evaluateSearchExpression(
        expression.right,
        countries,
        visitContext,
        qualifierOptions,
      );

      const leftIsoCodes = new Set(
        leftCountries.map((country) => country.isoCode),
      );

      return [
        ...leftCountries,
        ...rightCountries.filter(
          (country) => !leftIsoCodes.has(country.isoCode),
        ),
      ];
    }

    case "not": {
      const excludedCountries = evaluateSearchExpression(
        expression.expression,
        countries,
        visitContext,
        qualifierOptions,
      );

      const excludedIsoCodes = new Set(
        excludedCountries.map((country) => country.isoCode),
      );

      return countries.filter(
        (country) => !excludedIsoCodes.has(country.isoCode),
      );
    }
  }
}

/**
 * Apply qualifier-based search to a list of countries based on a search string that may include qualifiers and modifiers.
 * @param countries - List of countries to filter.
 * @param search - The search string, which may include qualifier-based search (e.g. "region:Europe").
 * @param visitedIsoCodes - List of ISO codes for visit-based qualifier searches.
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
  wantToVisitCodes?: string[],
): Country[] {
  const parsed = parseSearchQuery(search);

  const visitContext = buildVisitContextFromParams(
    visitedIsoCodes,
    visitedMap,
    visitedYearMap,
    wantToVisitCodes,
  );

  if (parsed) {
    const metadata = collectSearchMetadata(parsed);

    const modifiers = Object.fromEntries(
      metadata.modifiers.map(({ key, value }) => [key, value]),
    );

    const parsedModifiers = ensureModifiers(modifiers);

    if (metadata.hasQualifier) {
      const qualifierOptions: CountryQualifierOptions = {
        match: parsedModifiers.match,
        dst: parsedModifiers.dst,
        tcOption: metadata.tcEntry
          ? parseTCOption(String(metadata.tcEntry.value))
          : undefined,
      };

      const filteredCountries = evaluateSearchExpression(
        parsed,
        countries,
        visitContext,
        qualifierOptions,
      );

      return filterCountries(
        filteredCountries,
        {
          ...filterParams,
          modifiers: {
            ...(filterParams.modifiers ?? {}),
            ...parsedModifiers,
          },
          search: "",
          layerCountries: filteredIsoCodes,
        },
        visitContext,
      );
    }
  }

  if (search.includes(":")) {
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
