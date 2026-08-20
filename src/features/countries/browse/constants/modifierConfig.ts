/**
 * Modifier configuration and helpers for country filters.
 */

export const MODIFIER_MAP: Record<
  string,
  {
    key: string;
    label?: string;
    type?: "string" | "number" | "date" | "boolean";
  }
> = {
  match: { key: "match", label: "Match mode", type: "string" },
  tc: { key: "tc", label: "Transcontinental", type: "string" },
  dst: { key: "dst", label: "Include DST timezones", type: "boolean" },
  count: { key: "count", label: "Visit count", type: "number" },
  year: { key: "year", label: "Year", type: "number" },
  first: { key: "first", label: "First visit year", type: "number" },
  last: { key: "last", label: "Last visit year", type: "number" },
};

export const SUPPORTED_MODIFIERS = Object.keys(MODIFIER_MAP);
