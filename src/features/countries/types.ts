import type { FilterConfig } from "@types";

// Sort keys for countries

export type CountrySortByKey = "name" | "iso" | "firstVisit" | "lastVisit";

export type CountrySortBy =
  | `${CountrySortByKey}-asc`
  | `${CountrySortByKey}-desc`;

// Filter keys for countries

export type CountryFilterKey =
  | "region"
  | "subregion"
  | "sovereignty"
  | "overlay";

export type CountryFilterConfig<T = string, P = any> = FilterConfig<
  T,
  P,
  CountryFilterKey
>;
