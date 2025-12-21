import type { FilterConfig } from "@types";

/** Represents a country with various attributes. */
export type Country = {
  /** The official name of the country */
  name: string;
  /** The emoji flag representing the country */
  flag: string;
  /** The international calling code for the country */
  callingCode: string;
  /** The ISO 3166-1 alpha-2 code for the country */
  isoCode: string;
  /** The ISO 3166-1 alpha-3 code for the country */
  iso3Code: string;
  /** The region where the country is located */
  region: string;
  /** The subregion where the country is located */
  subregion?: string;
  /** The capital city of the country */
  capital?: string;
  /** The population of the country */
  population?: number;
  /** The currency used in the country */
  currency?: string;
  /** The languages spoken in the country */
  languages?: string[];
  /** The sovereignty type of the country */
  sovereigntyType?: SovereigntyType;
};

/** Sovereignty types for countries. */
export type SovereigntyType =
  | "Sovereign"
  | "Dependency"
  | "Overseas Region"
  | "Unrecognized"
  | "Disputed"
  | "Unknown";

/** Sort keys for countries. */
export type CountrySortByKey = "name" | "iso" | "firstVisit" | "lastVisit";

/** Sort options for countries. */
export type CountrySortBy =
  | `${CountrySortByKey}-asc`
  | `${CountrySortByKey}-desc`;

/** Filter keys for countries */
export type CountryFilterKey =
  | "region"
  | "subregion"
  | "sovereignty"
  | "overlay";

/** Configuration for country filters. */
export type CountryFilterConfig<T = string, P = unknown> = FilterConfig<
  T,
  P,
  CountryFilterKey
>;

/** Options for filtering countries. */
export type CountryFilterOptions = {
  search?: string;
  selectedRegion?: string;
  selectedSubregion?: string;
  selectedSovereignty?: SovereigntyType | "";
  overlayCountries?: string[];
};
