import {
  getAllRegions,
  getSubregionsForRegion,
  type Country,
} from "@features/countries";
import { useVisitedCountries } from "@features/visits";

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
  const regionStats = regions.map((region) => {
    const regionCountries = countries.filter((c) => c.region === region);
    const regionVisited = regionCountries.filter((c) =>
      isCountryVisited(c.isoCode),
    ).length;
    const subregions = getSubregionsForRegion(countries, region).map((sub) => {
      const subCountries = regionCountries.filter((c) => c.subregion === sub);
      const subVisited = subCountries.filter((c) =>
        isCountryVisited(c.isoCode),
      ).length;
      return {
        name: sub,
        visited: subVisited,
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
