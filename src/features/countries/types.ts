import type { VisitedStatus } from "@features/visits";
import type { Operator } from "@types";

/** Represents a country with various attributes. */
export type Country = {
  /** The official name of the country. */
  name: string;
  /** The ISO 3166-1 alpha-2 code for the country. */
  isoCode: string;
  /** The ISO 3166-1 alpha-3 code for the country. */
  iso3Code: string;
  /** The region where the country is located. */
  region: string;
  /** The subregion where the country is located. */
  subregion?: string;
  /** The capital city of the country. */
  capital?: string;
  /** The languages spoken in the country. */
  languages?: string[];
  /** The population of the country. */
  population?: number;
  /** The currency used in the country. */
  currency?: string;
  /** The timezone for the country. */
  timezones?: string[];
  /** The international calling code for the country. */
  callingCode: string;
  /** The sovereignty type of the country. */
  sovereigntyType?: SovereigntyType;
  /** Alternative names or abbreviations for the country. */
  aliases?: string[];
};

/** Represents a currency. */
export type Currency = {
  code: string;
  name: string;
};

/** Sovereignty types for countries. */
export type SovereigntyType =
  | "Sovereign"
  | "Dependency"
  | "Overseas Region"
  | "Unrecognized"
  | "Disputed"
  | "Unknown";

/** Represents a list of countries. */
export type CountryList = {
  id: string;
  name: string;
  countryCodes: string[];
  layerId?: string | null;
};

/** Modifier configuration for country filtering. */
export type CountryModifiers = {
  match?: "prefix" | "substring" | "exact" | "regex";
  tc?: string;
  dst?: boolean | string;
  of?: string;
  count?: { op: Operator; value: number } | undefined;
  year?: { op: Operator; year: number } | undefined;
  first?: { op: Operator; year: number } | undefined;
  last?: { op: Operator; year: number } | undefined;
};

/** Options for filtering countries. */
export type CountryFilterOptions = {
  search?: string;
  selectedRegion?: string;
  selectedSubregion?: string;
  selectedSovereignty?: SovereigntyType | "";
  selectedVisited?: VisitedStatus;
  layerCountries?: string[];
  modifiers?: CountryModifiers;
};

/** Represents the allowed values for transcontinental scope flags. */
export type TranscontinentalScope = "all" | "contiguous" | "overseas" | "other";

/** Represents the mode for transcontinental country inclusion in filters. */
export type TranscontinentalMode = "default" | "include" | "only";
