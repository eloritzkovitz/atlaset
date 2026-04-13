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
  | "tc";

/** Configuration for a country qualifier search. */
export type CountryQualifierConfig = {
  key: CountryQualifierKey;
  label?: string;
  type?: "string" | "number" | "date";
};

export const COUNTRY_QUALIFIER_MAP: Record<string, CountryQualifierConfig> = {
  isocode: { key: "isoCode", label: "ISO 3166-1 code", type: "string" },
  iso3code: {
    key: "iso3Code",
    label: "ISO 3166-1 alpha-3 code",
    type: "string",
  },
  region: { key: "region", label: "Region", type: "string" },
  subregion: { key: "subregion", label: "Subregion", type: "string" },
  capital: { key: "capital", label: "Capital", type: "string" },
  language: { key: "languages", label: "Language", type: "string" },
  population: { key: "population", label: "Population", type: "number" },
  currency: { key: "currency", label: "Currency", type: "string" },
  timezone: { key: "timezones", label: "Time zone", type: "string" },
  tz: { key: "timezones", label: "Time zone", type: "string" },
  callingcode: { key: "callingCode", label: "Calling code", type: "string" },
  drivingside: { key: "drivingSide", label: "Driving side", type: "string" },
  sovereignty: { key: "sovereigntyType", label: "Sovereignty", type: "string" },
  sovereign: { key: "sovereign", label: "Sovereign", type: "string" },
  visited: { key: "visited", label: "Visited", type: "string" },
  tc: { key: "tc", label: "Transcontinental", type: "string" },
};

export const SUPPORTED_QUALIFIERS = keysOf(COUNTRY_QUALIFIER_MAP);

export const ALL_SORT_KEY_OPTIONS = [
  { value: "name", label: "Name" },
  { value: "isoCode", label: "ISO 3166-1 code" },
  { value: "visitCount", label: "Visit count" },
  { value: "firstVisit", label: "First visit time" },
  { value: "lastVisit", label: "Last visit time" },
];
