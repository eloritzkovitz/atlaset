import type { Country } from "@features/countries";

/** Represent a region's statistics.*/
export interface RegionStat {
  region: string;
  regionVisited: number;
  regionCountries: Country[];
  subregions: SubregionStat[];
}

/** Represent a subregion's statistics. */
export interface SubregionStat {
  subregion: string;
  subregionVisited: number;
  subregionCountries: Country[];
}
