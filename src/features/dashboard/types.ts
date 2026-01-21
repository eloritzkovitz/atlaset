export interface SubregionStat {
  name: string;
  visited: number;
  total: number;
}

/** Represents the criteria for an achievement. */
export interface Criteria {
  region?: string;
  subregion?: string;
  countries?: string[];
  count?: number;
  regions?: string[];
  min_regions?: number;
  trip_countries_count?: number;
  trip_duration_days?: number;
  abroad_trips_count?: number;
  local_trips_count?: number;
  abroad_countries_count?: number;
  repeat_visits_count?: number;
  repeat_min_visits?: number;
  only_abroad?: boolean;
  tier?: number;
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

/** Represents the status of an achievement */
export type AchievementStatus = "locked" | "progress" | "completed";
