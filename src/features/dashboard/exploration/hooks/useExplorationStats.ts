import {
  getAllRegions,
  getSubregionsForRegion,
  type Country,
} from "@features/countries";
import { useCountryCoverage } from "@features/visits/hooks/useCountryCoverage";
import { useCountryTracking } from "@features/visits/hooks/useCountryTracking";
import type { RegionStat, SubregionStat } from "../types";

/**
 * Calculates exploration statistics.
 * @param countries - List of all countries
 * @param sovereignOnly - Whether to consider only sovereign countries for the statistics.
 * @returns Exploration statistics including total countries, visited countries and stats by region and subregion.
 */
export function useExplorationStats(
  countries: Country[],
  sovereignOnly = false,
) {
  const { totalCountries, visitedCountries } = useCountryCoverage(
    countries,
    sovereignOnly,
  );
  const { isVisitedCountry } = useCountryTracking();

  const effectiveCountries = sovereignOnly
    ? countries.filter((c) => c.sovereigntyStatus === "sovereign")
    : countries;

  const regions = getAllRegions(effectiveCountries);

  // Compute stats for each region and its subregions
  const regionStats: RegionStat[] = regions.map((region) => {
    const regionCountries = effectiveCountries.filter(
      (c) => c.region === region,
    );
    const regionVisited = regionCountries.filter((country) =>
      isVisitedCountry(country.isoCode),
    ).length;

    const subregions: SubregionStat[] = getSubregionsForRegion(
      effectiveCountries,
      region,
    ).map((sub) => {
      const subCountries = regionCountries.filter((c) => c.subregion === sub);
      const subVisited = subCountries.filter((country) =>
        isVisitedCountry(country.isoCode),
      ).length;

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
