import type { VisitedStatus } from "@features/visits";
import type { Operator } from "@types";

/** Represents a country with various attributes. */
export type Country = {
  /** The official name of the country. */
  name: string;
  /** Alternative names or abbreviations for the country. */
  altNames?: string[];
  /** The ISO 3166-1 alpha-2 code for the country. */
  isoCode: string;
  /** The ISO 3166-1 alpha-3 code for the country. */
  iso3Code: string;
  /** The region where the country is located. */
  region: string;
  /** The subregion where the country is located. */
  subregion?: string;
  /** Transcontinental information for the country. */
  transcontinental?: TranscontinentalInfo;
  /** The geographic type of the country. */
  geoType?: GeoType;
  /** The capital city of the country. */
  capital?: string;
  /** The languages spoken in the country. */
  languages?: string[];
  /** The government type of the country. */
  government?: string;
  /** The area of the country in square kilometers. */
  area?: number;
  /** The population of the country. */
  population?: number;
  /** The currency used in the country. */
  currency?: string;
  /** The timezone for the country. */
  timezones?: string[];
  /** The international calling code for the country. */
  callingCode: string;
  /** The road traffic direction for the country. */
  drivingSide?: "Left" | "Right" | undefined;
  /** The sovereignty status of the country. */
  sovereigntyStatus?: SovereigntyStatus;
  /** The sovereign state of the country. */
  sovereignState?: string;
  /** List of territories & claims for the country. */
  territories?: CountryTerritories;
  /** Whether the country is a UN member. */
  unMember?: boolean;
  /** The organizations the country is a member of. */
  memberOf?: string[];
};

/** Represents an entry for a transcontinental country. */
export type TranscontinentalInfo = {
  /** Additional continent/region */
  additionalRegion?: string;
  /** Additional subregion */
  additionalSubregion?: string;
  /** The scope of the transcontinental nature, if specified. */
  scope?: TranscontinentalScope;
};

/** Represents the allowed values for transcontinental scope flags. */
export type TranscontinentalScope =
  | "all"
  | "contiguous"
  | "overseas"
  | "cultural"
  | "other";

/** Represents the mode for transcontinental country inclusion in filters. */
export type TranscontinentalMode = "default" | "include" | "only";

/** Represents a currency. */
export type Currency = {
  code: string;
  name: string;
};

/** Sovereignty statuses for countries. */
export type SovereigntyStatus =
  | "Sovereign"
  | "Dependency"
  | "Overseas Region"
  | "Unrecognized"
  | "Disputed"
  | "Unknown";

/** Geographic types for countries. */
export type GeoType = "Coastal" | "Landlocked" | "Island";

export type CountryTerritoriesGroup = {
  codes: string[];
  label?: string;
};

export type CountryTerritories = Record<string, CountryTerritoriesGroup>;

/** Represents a list of countries. */
export type CountryList = {
  id: string;
  name: string;
  countryCodes: string[];
  layerId?: string | null;
};

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
  type?: "string" | "boolean" | "number" | "date";
};

/** Modifier configuration for country filtering. */
export type CountryModifiers = {
  match?: "prefix" | "substring" | "exact" | "regex";
  tc?: string;
  tcOption?: { scope?: TranscontinentalScope; mode?: TranscontinentalMode };
  dst?: boolean | string;
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
  selectedGeoType?: GeoType | "";
  selectedSovereignty?: SovereigntyStatus | "";
  selectedVisited?: VisitedStatus;
  layerCountries?: string[];
  modifiers?: CountryModifiers;
};
