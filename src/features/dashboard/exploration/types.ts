import type { Country } from "@features/countries";

/** Represents the type of countries to display. */
export type CountryType = "all" | "sovereign";

/** Represents a region's statistics.*/
export interface RegionStat {
  region: string;
  regionVisited: number;
  regionCountries: Country[];
  subregions: SubregionStat[];
}

/** Represents a subregion's statistics. */
export interface SubregionStat {
  subregion: string;
  subregionVisited: number;
  subregionCountries: Country[];
}
