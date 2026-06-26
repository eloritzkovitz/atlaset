/**
 * Shared qualifier and sort configuration for countries.
 */
import { keysOf } from "@utils/object";
import type { CountryQualifierConfig } from "../types";

export const COUNTRY_QUALIFIER_MAP: Record<string, CountryQualifierConfig> = {
  isocode: { key: "isoCode", label: "ISO 3166-1 code", type: "string" },
  iso3code: {
    key: "iso3Code",
    label: "ISO 3166-1 alpha-3 code",
    type: "string",
  },
  region: { key: "region", label: "Region", type: "string" },
  subregion: { key: "subregion", label: "Subregion", type: "string" },
  tc: { key: "tc", label: "Transcontinental", type: "string" },
  geotype: { key: "geoType", label: "Geographic type", type: "string" },
  capital: { key: "capital", label: "Capital", type: "string" },
  language: { key: "languages", label: "Language", type: "string" },
  government: { key: "government", label: "Government type", type: "string" },
  structure: { key: "structure", label: "State structure", type: "string" },
  area: { key: "area", label: "Area (km²)", type: "number" },
  population: { key: "population", label: "Population", type: "number" },
  currency: { key: "currency", label: "Currency", type: "string" },
  timezone: { key: "timezones", label: "Time zone", type: "string" },
  tz: { key: "timezones", label: "Time zone", type: "string" },
  callingcode: { key: "callingCode", label: "Calling code", type: "string" },
  drivingside: { key: "drivingSide", label: "Driving side", type: "string" },
  sovereignty: { key: "sovereigntyStatus", label: "Sovereignty", type: "string" },
  sovereign: { key: "sovereign", label: "Sovereign", type: "string" },
  unmember: { key: "unMember", label: "UN member", type: "boolean" },
  memberof: { key: "memberOf", label: "Member of", type: "string" },
  visited: { key: "visited", label: "Visited", type: "boolean" },
  wanttovisit: { key: "wantToVisit", label: "Want to visit", type: "boolean" },
};

export const SUPPORTED_QUALIFIERS = keysOf(COUNTRY_QUALIFIER_MAP);
