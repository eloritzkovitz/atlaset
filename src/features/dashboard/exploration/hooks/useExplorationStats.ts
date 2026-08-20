import {
  getAllRegions,
  getSubregionsForRegion,
  type Country,
} from "@features/countries";
import { useCountryTracking } from "@features/visits";
import type { RegionStat, SubregionStat } from "../types";
import { countVisited } from "../../statistics/utils/visitStats";

/**
 * Calculates exploration statistics for the countries panel.
 * @param countries - List of all countries
 * @returns Exploration statistics including total countries, visited countries and stats by region and subregion.
 */
export function useExplorationStats(
  countries: Country[],
  sovereignOnly = false,
) {
  const { isVisitedCountry, visitedCountryCodes } = useCountryTracking();
  const effectiveCountries = sovereignOnly
    ? countries.filter((c) => c.sovereigntyStatus === "sovereign")
    : countries;
  const effectiveIso = new Set(effectiveCountries.map((c) => c.isoCode));
  const totalCountries = effectiveCountries.length;
  const visitedCountries = visitedCountryCodes.reduce(
    (n, iso) => n + (effectiveIso.has(iso) ? 1 : 0),
    0,
  );
  const regions = getAllRegions(effectiveCountries);

  // Compute stats for each region and its subregions
  const regionStats: RegionStat[] = regions.map((region) => {
    const regionCountries = effectiveCountries.filter(
      (c) => c.region === region,
    );
    const regionVisited = countVisited(regionCountries, isVisitedCountry);
    const subregions: SubregionStat[] = getSubregionsForRegion(
      effectiveCountries,
      region,
    ).map((sub) => {
      const subCountries = regionCountries.filter((c) => c.subregion === sub);
      const subVisited = countVisited(subCountries, isVisitedCountry);
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
