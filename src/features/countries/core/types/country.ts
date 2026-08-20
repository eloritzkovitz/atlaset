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
  /** The government system of the country. */
  government?: string;
  /** The state structure of the country. */
  structure?: string;
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

/** Sovereignty statuses for countries. */
export type SovereigntyStatus =
  | "sovereign"
  | "dependency"
  | "overseas_region"
  | "special_territory"
  | "partially_recognized"
  | "unrecognized"
  | "disputed"
  | "unknown";

export type NonSovereignStatus = Exclude<SovereigntyStatus, "sovereign">;

/** Geographic types for countries. */
export type GeoType = "Coastal" | "Landlocked" | "Island";

/** Represents a group of territories for a country. */
export type CountryTerritoriesGroup = {
  codes: string[];
  label?: string;
  type?: SovereigntyStatus;
};

/** Represents the territories and claims for a country. */
export type CountryTerritories = Record<string, CountryTerritoriesGroup>;
