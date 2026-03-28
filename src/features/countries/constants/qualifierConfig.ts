/**
 * Shared qualifier and sort configuration for countries.
 */
import { keysOf } from "@utils/object";
import type { Country } from "../types";

/** Represents a key for a country qualifier search. */
export type CountryQualifierKey =
  | keyof Country
  | "sovereign"
  | "visited"
  | "visits"
  | "visitYear"
  | "firstVisit"
  | "lastVisit";

/** Configuration for a country qualifier search. */
export type CountryQualifierConfig = {
  key: CountryQualifierKey;
  label?: string;
  type?: "string" | "number" | "date";
};

export const COUNTRY_QUALIFIER_MAP: Record<string, CountryQualifierConfig> = {
  isocode: { key: "isoCode", label: "ISO code", type: "string" },
  region: { key: "region", label: "Region", type: "string" },
  subregion: { key: "subregion", label: "Subregion", type: "string" },
  capital: { key: "capital", label: "Capital", type: "string" },
  currency: { key: "currency", label: "Currency", type: "string" },
  language: { key: "languages", label: "Language", type: "string" },
  callingcode: { key: "callingCode", label: "Calling code", type: "string" },
  sovereignty: { key: "sovereigntyType", label: "Sovereignty", type: "string" },
  sovereign: { key: "sovereign", label: "Sovereign", type: "string" },
  visited: { key: "visited", label: "Visited", type: "string" },
  visits: { key: "visits", label: "Visit count", type: "number" },
  visityear: { key: "visitYear", label: "Visit year", type: "number" },
  firstvisit: { key: "firstVisit", label: "First visit", type: "date" },
  lastvisit: { key: "lastVisit", label: "Last visit", type: "date" },
};

export const SUPPORTED_QUALIFIERS = keysOf(COUNTRY_QUALIFIER_MAP);

export const ALL_SORT_KEY_OPTIONS = [
  { value: "name", label: "Name" },
  { value: "isoCode", label: "ISO 3166-1 code" },
  { value: "visitCount", label: "Visit count" },
  { value: "firstVisit", label: "First visit time" },
  { value: "lastVisit", label: "Last visit time" },
];
