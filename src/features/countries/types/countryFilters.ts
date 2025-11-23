import type { FilterConfig } from "@types";

// Country-specific filter keys and config types
export type CountryFilterKey = "region" | "subregion" | "sovereignty" | "overlay";

export type CountryFilterConfig<T = string, P = any> = FilterConfig<T, P, CountryFilterKey>;