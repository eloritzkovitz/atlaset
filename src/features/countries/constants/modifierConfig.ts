/**
 * Modifier configuration and helpers for country filters.
 */

import { keysOf } from "@utils/object";

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
