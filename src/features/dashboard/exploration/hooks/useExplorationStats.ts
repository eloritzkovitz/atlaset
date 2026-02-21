import {
  getAllRegions,
  getSubregionsForRegion,
  type Country,
} from "@features/countries";
import { useVisitedCountries } from "@features/visits";
import type { RegionStat, SubregionStat } from "../types";
import { countVisited } from "../../statistics/utils/visitStats";

/**
 * Calculates exploration statistics for the countries panel.
 * @param countries - List of all countries
 * @returns Exploration statistics including total countries, visited countries, and stats by region and subregion.
 */
export function useExplorationStats(countries: Country[]) {
  const { isCountryVisited, visitedCountryCodes } = useVisitedCountries();
  const totalCountries = countries.length;
  const visitedCountries = visitedCountryCodes.length;
  const regions = getAllRegions(countries);

  // Compute stats for each region and its subregions
  const regionStats: RegionStat[] = regions.map((region) => {
    const regionCountries = countries.filter((c) => c.region === region);
    const regionVisited = countVisited(regionCountries, isCountryVisited);
    const subregions: SubregionStat[] = getSubregionsForRegion(
      countries,
      region,
    ).map((sub) => {
      const subCountries = regionCountries.filter((c) => c.subregion === sub);
      const subVisited = countVisited(subCountries, isCountryVisited);
      return {
        subregion: sub,
        subregionVisited: subVisited,
        subregionCountries: subCountries,
        total: subCountries.length,
      };
    });
    return {
      region,
      regionVisited,
      regionCountries,
      subregions,
    };
  });

  return { totalCountries, visitedCountries, regionStats };
}
