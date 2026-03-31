/**
 * Modifier normalization helpers moved out of constants for clearer separation.
 */

import { type VisitContext } from "@features/visits/types";
import {
  getFirstYearFor,
  getLastYearFor,
  getVisitCountFor,
  hasVisitInYearFor,
} from "@features/visits/utils/visitHelpers";
import {
  compareNumeric,
  parseComparator,
  parseYearComparator,
} from "@utils/number";
import { COUNTRY_RELATIONS } from "../constants/countryRelations";
import { TRANSCONTINENTAL_MAP } from "../constants/transcontinental";
import type {
  Country,
  CountryModifiers,
  TranscontinentalMode,
  TranscontinentalScope,
} from "../types";

/**
 * Normalizes raw modifier inputs into a structured CountryModifiers object.
 * Accepts various formats for boolean and numeric modifiers, ensuring consistent output for filtering logic.
 * @param mods - A record of raw modifier keys and values, typically parsed from user input or query parameters.
 * @returns A CountryModifiers object with properly typed and normalized values for use in country filtering.
 * @see CountryModifiers for the expected structure of the output.
 */
export function normalizeModifiers(
  mods?: Record<string, boolean | string>,
): CountryModifiers {
  const out: CountryModifiers = {};
  if (!mods) return out;
  if (typeof mods.tc !== "undefined")
    out.tc = mods.tc as CountryModifiers["tc"];
  if (typeof mods.of !== "undefined") out.of = String(mods.of).toUpperCase();
  out.count = mods.count
    ? (parseComparator(String(mods.count), "\\d+") ?? undefined)
    : undefined;
  out.year = mods.year
    ? (parseYearComparator(String(mods.year)) ?? undefined)
    : undefined;
  out.first = mods.first
    ? (parseYearComparator(String(mods.first)) ?? undefined)
    : undefined;
  out.last = mods.last
    ? (parseYearComparator(String(mods.last)) ?? undefined)
    : undefined;

  // normalize match mode modifier
  if (typeof mods.match === "string") {
    const m = mods.match.trim();
    if (m) out.match = m as CountryModifiers["match"];
  }
  return out;
}

/**
 * Ensures that a given input is properly normalized into a CountryModifiers object, applying default values and normalization as needed.
 * @param mods - An optional input that may already be a CountryModifiers object or a raw record of modifier keys and values.
 * @returns A normalized CountryModifiers object.
 */
export function ensureModifiers(mods?: unknown): CountryModifiers {
  if (!mods) return {};
  const asAny = mods as unknown as CountryModifiers;
  if (
    asAny &&
    (typeof asAny.count === "object" ||
      typeof asAny.year === "object" ||
      typeof asAny.first === "object" ||
      typeof asAny.last === "object")
  ) {
    return asAny as CountryModifiers;
  }
  return normalizeModifiers(
    mods as Record<string, boolean | string> | undefined,
  );
}

/**
 * Returns true if the given country is related to the provided sovereignty ISO (dependencies or regions).
 */
export function matchesSovereigntyOf(
  country: Country,
  ofIso?: string | undefined,
) {
  if (!ofIso) return false;
  const sovereignEntry = COUNTRY_RELATIONS[ofIso];
  const deps = [
    ...(sovereignEntry?.dependencies ?? []),
    ...(sovereignEntry?.regions ?? []),
  ];
  return deps.includes(country.isoCode);
}

/**
 * Parses the scope and mode of transcontinental inclusion for country filtering.
 * @param raw - The raw input value for the transcontinental modifier.
 * @returns An object containing the parsed scope and mode for transcontinental country inclusion in filters.
 * @see TranscontinentalScope for the expected scope values and their meanings.
 * @see TranscontinentalMode for the expected mode values and their meanings.
 */
export function parseTCOption(raw?: string): {
  scope?: TranscontinentalScope;
  mode: TranscontinentalMode;
} {
  if (typeof raw === "string") {
    const v = raw.toLowerCase().trim();
    if (!v) return { mode: "default" };

    const parts = v
      .split(":")
      .map((p) => p.trim())
      .filter(Boolean);
    let scope: TranscontinentalScope | undefined;
    let mode: TranscontinentalMode = "default";

    for (const p of parts) {
      if (p === "only") {
        mode = "only";
      } else if (p === "include") {
        mode = "include";
      } else if (p === "all") {
        scope = "all";
      } else if (p === "contiguous" || p === "overseas" || p === "other") {
        scope = p as TranscontinentalScope;
      }
    }

    // Determine final scope based on mode if not explicitly set
    const finalScope: TranscontinentalScope | undefined =
      typeof scope !== "undefined"
        ? scope
        : mode === "only" || mode === "include"
          ? "all"
          : undefined;

    return { scope: finalScope, mode };
  }
  return { mode: "default" };
}

/**
 * Returns true if the given country matches the requested transcontinental option.
 */
export function matchesTranscontinental(
  country: Country,
  tcOption?: TranscontinentalScope,
) {
  if (!tcOption) return false;
  const entry = TRANSCONTINENTAL_MAP.get(
    country.isoCode?.toUpperCase?.() ?? "",
  );
  if (!entry) return false;
  if (tcOption === "all") return true;
  const entryScope = entry.scope ?? "contiguous";
  return entryScope === tcOption;
}

/**
 * Applies modifiers to a country to determine if it matches visit-related criteria.
 * @param country - The country to check against the modifiers.
 * @param mods - The modifiers to apply, which may include visit-related criteria.
 * @param visitContext - Optional context containing visit information for evaluating visit-related modifiers.
 * @returns True if the country matches the modifiers, false otherwise.
 * @see CountryModifiers for supported modifiers.
 */
export function applyModifiersToCountry(
  country: Country,
  mods: CountryModifiers,
  visitContext?: VisitContext,
) {
  if (!mods) return true;

  if (mods.of) {
    const ofIso = String(mods.of).toUpperCase();
    if (!matchesSovereigntyOf(country, ofIso)) return false;
  }

  const vmap = visitContext?.visitedMap;
  const ymap = visitContext?.visitedYearMap;
  const visitedIso = visitContext?.visitedIsoCodes ?? [];
  const firstVisitMap = visitContext?.firstVisitMap;
  const lastVisitMap = visitContext?.lastVisitMap;

  if (mods.count) {
    const parsedCount = mods.count;
    const count = getVisitCountFor(country.isoCode, vmap, visitedIso);
    if (!compareNumeric(parsedCount.op, count, parsedCount.value)) return false;
  }

  if (mods.year) {
    const { op, year } = mods.year;
    if (op === "=") {
      if (!hasVisitInYearFor(country.isoCode, year, ymap)) return false;
    } else {
      const firstYear = getFirstYearFor(country.isoCode, firstVisitMap, ymap);
      if (firstYear === null) return false;
      if (!compareNumeric(op, firstYear, year)) return false;
    }
  }

  if (mods.first) {
    const { op, year } = mods.first;
    const firstYear = getFirstYearFor(country.isoCode, firstVisitMap, ymap);
    if (firstYear === null) return false;
    if (!compareNumeric(op, firstYear, year)) return false;
  }

  if (mods.last) {
    const { op, year } = mods.last;
    const lastYear = getLastYearFor(country.isoCode, lastVisitMap, ymap);
    if (lastYear === null) return false;
    if (!compareNumeric(op, lastYear, year)) return false;
  }

  return true;
}
