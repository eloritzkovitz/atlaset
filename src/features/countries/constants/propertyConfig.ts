/**
 * Shared property and sort configuration for countries.
 */
import type { Country } from "../types";

/** Represents a key for a country property search. */
export type CountryPropertyKey =
  | keyof Country
  | "sovereign"
  | "visited"
  | "visits"
  | "visitYear"
  | "firstVisit"
  | "lastVisit";

/** Configuration for a country property search. */
export type CountryPropertyConfig = {
  key: CountryPropertyKey;
  label?: string;
  type?: "string" | "number" | "date";
  includeTC?: boolean;
};

export const COUNTRY_PROPERTY_MAP: Record<string, CountryPropertyConfig> = {
  isocode: { key: "isoCode", label: "ISO code", type: "string" },
  region: { key: "region", label: "Region", type: "string" },
  region_tc: {
    key: "region",
    label: "Region (including transcontinental countries)",
    type: "string",
    includeTC: true,
  },
  subregion: { key: "subregion", label: "Subregion", type: "string" },
  subregion_tc: {
    key: "subregion",
    label: "Subregion (including transcontinental countries)",
    type: "string",
    includeTC: true,
  },
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

export const ALL_SORT_KEY_OPTIONS = [
  { value: "name", label: "Name" },
  { value: "isoCode", label: "ISO 3166-1 code" },
  { value: "visitCount", label: "Visit count" },
  { value: "firstVisit", label: "First visit time" },
  { value: "lastVisit", label: "Last visit time" },
];
