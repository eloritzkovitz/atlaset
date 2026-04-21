import type { CountryQualifierKey } from "@features/countries";

/** Primitive criterion value types used for country matching. */
export type CountryCriterionValue =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | Record<string, unknown>;

/** Represents country-related criteria for achievements. */
export type CountryCriteria = Partial<
  Record<CountryQualifierKey, CountryCriterionValue>
>;

/** Represents geographic-related criteria for achievements. */
export interface GeoCriteria {
  countries?: string[];
  regions?: string[];
}

/** Represents trip-related criteria for achievements. */
export interface TripCriteria {
  trip_countries_count?: number;
  trip_duration_days?: number;
  local_trips_count?: number;
  abroad_trips_count?: number;
  only_abroad?: boolean;
}

/** Represents modifier criteria that can be applied to achievements. */
export interface ModifierCriteria {
  tier?: number;
  required?: number;
}

/** Represents the criteria for an achievement. */
export type Criteria = CountryCriteria &
  GeoCriteria &
  TripCriteria &
  ModifierCriteria &
  Record<string, unknown>;

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
