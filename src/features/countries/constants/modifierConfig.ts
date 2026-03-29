/**
 * Modifier configuration and helpers for country filters.
 */

import type { Operator } from "@types";
import { parseComparator, parseYearComparator } from "@utils/number";
import { keysOf } from "@utils/object";
import type { TranscontinentalScope } from "../types";

export type CountryModifiers = {
  tc?: boolean | string | TranscontinentalScope;
  of?: string;
  visited?: boolean;
  count?: { op: Operator; value: number } | undefined;
  year?: { op: Operator; year: number } | undefined;
  first?: { op: Operator; year: number } | undefined;
  last?: { op: Operator; year: number } | undefined;
};

export const MODIFIER_MAP: Record<
  string,
  {
    key: string;
    label?: string;
    type?: "string" | "number" | "date" | "boolean";
  }
> = {
  tc: { key: "tc", label: "Transcontinental", type: "string" },
  of: { key: "of", label: "Sovereignty", type: "string" },
  visited: { key: "visited", label: "Visited", type: "boolean" },
  count: { key: "count", label: "Visit count", type: "number" },
  year: { key: "year", label: "Year", type: "number" },
  first: { key: "first", label: "First visit year", type: "number" },
  last: { key: "last", label: "Last visit year", type: "number" },
};

export const SUPPORTED_MODIFIERS = keysOf(MODIFIER_MAP);

/**
 * Normalizes raw modifier inputs into the structured CountryModifiers format. This allows for flexible input while ensuring consistent structure for filter processing.
 * @param mods - The raw modifiers to normalize, typically parsed from user input. Can be undefined, in which case an empty object is returned.
 * @returns A CountryModifiers object with properly typed properties, normalized from the raw input.
 * @see CountryModifiers for the expected structure of the output modifiers.
 */
export function normalizeModifiers(
  mods?: Record<string, boolean | string>,
): CountryModifiers {
  const out: CountryModifiers = {};
  if (!mods) return out;
  if (typeof mods.tc !== "undefined")
    out.tc = mods.tc as CountryModifiers["tc"];
  if (typeof mods.of !== "undefined") out.of = String(mods.of).toUpperCase();
  if (typeof mods.visited !== "undefined") {
    const v = mods.visited;
    if (typeof v === "boolean") out.visited = v;
    else if (typeof v === "string") {
      const lv = v.toLowerCase();
      if (lv === "true") out.visited = true;
      if (lv === "false") out.visited = false;
    }
  }
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
  return out;
}

/**
 * Ensure that the provided modifiers are in the correct typed format. If they appear to be in raw format, normalize them.
 * This allows flexibility in how modifiers are passed while ensuring consistent structure for filter processing.
 * @param mods - The raw or already-typed modifiers to ensure. Can be undefined, in which case an empty object is returned.
 * @returns A CountryModifiers object with properly typed properties, either directly from the input if already in correct format, or normalized from raw input.
 * @see normalizeModifiers for the normalization logic applied to raw modifier inputs.
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
