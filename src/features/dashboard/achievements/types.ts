import type { Country } from "@features/countries";

/** Represents the criteria for an achievement. */
export interface Criteria {
  [key: string]: unknown;
  countries?: string[];
  regions?: string[];
  region?: string;
  subregion?: string;
  sovereign_only?: boolean;
  currency?: string;
  languages?: string[];
  count?: number;
  min_regions?: number;
  tier?: number;
  trip_countries_count?: number;
  trip_duration_days?: number;
  local_trips_count?: number;
  abroad_trips_count?: number;
  abroad_countries_count?: number;
  repeat_visits_count?: number;
  repeat_min_visits?: number;
  only_abroad?: boolean;
}

/** Represents a tier within an achievement. */
export interface Tier {
  tier?: number;
  criteria?: Criteria;
  count?: number;
  name?: string;
  description?: string;
  icon?: string;
}

/** Represents an achievement. */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: string;
  criteria?: Criteria;
  countries?: string[];
  icon?: string;
  requires?: string[];
  tiers?: Tier[];
}

/** Represents the status of an achievement. */
export type AchievementStatus = "locked" | "progress" | "completed";

/** Represents the keys for country criteria filters. */
export type CountryCriteriaKey =
  | "countries"
  | "region"
  | "subregion"
  | "currency"
  | "languages";

/** Represents a map of country criteria filters. */
export type CountryCriteriaFilterMap = {
  [K in CountryCriteriaKey]: (c: Country) => boolean;
} & {
  [key: string]: (c: Country) => boolean;
};
