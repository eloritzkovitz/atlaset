/**
 * Utility functions for handling country modifiers.
 */

import { type VisitContext } from "@features/visits/types";
import {
  getFirstYearFor,
  getLastYearFor,
  getVisitCountFor,
  hasVisitInYearFor,
} from "@features/visits/utils/visitHelpers";
import { compareNumeric, parseComparator, parseYearComparator } from "@utils";
import type { CountryModifiers, CountryVisitModifiers } from "../types";
import type { Country } from "../../types";

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

  // Normalize DST modifier to boolean if possible, otherwise keep as string for potential special handling
  if (typeof mods.dst !== "undefined") {
    const d = mods.dst;
    if (typeof d === "boolean") {
      out.dst = d;
    } else {
      const s = String(d).toLowerCase().trim();
      if (s === "true" || s === "yes" || s === "1") out.dst = true;
      else if (s === "false" || s === "no" || s === "0") out.dst = false;
      else out.dst = d as CountryModifiers["dst"];
    }
  }

  // Normalize match modifier if it's a non-empty string
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
 * Applies modifiers to a country to determine if it matches visit-related criteria.
 * @param country - The country to check against the modifiers.
 * @param mods - The modifiers to apply, which may include visit-related criteria.
 * @param visitContext - Optional context containing visit information for evaluating visit-related modifiers.
 * @returns True if the country matches the modifiers, false otherwise.
 * @see CountryVisitModifiers for supported modifiers.
 */
export function applyVisitModifiersToCountry(
  country: Country,
  mods: CountryVisitModifiers,
  visitContext?: VisitContext,
) {
  if (!mods) return true;

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
