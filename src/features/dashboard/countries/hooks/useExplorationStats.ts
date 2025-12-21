import {
  getAllRegions,
  getSubregionsForRegion,
  type Country,
} from "@features/countries";

export function useExplorationStats(
  countries: Country[],
  visited: {
    isCountryVisited: (iso: string) => boolean;
    visitedCountryCodes: string[];
  }
) {
  // Calculate overall stats
  const totalCountries = countries.length;
  const visitedCountries = countries.filter((c) =>
    visited.isCountryVisited(c.isoCode)
  ).length;
  const regions = getAllRegions(countries);

  // Compute stats per region and subregion
  const regionStats = regions.map((region) => {
    const regionCountries = countries.filter((c) => c.region === region);
    const regionVisited = regionCountries.filter((c) =>
      visited.isCountryVisited(c.isoCode)
    ).length;
    const subregions = getSubregionsForRegion(countries, region).map((sub) => {
      const subCountries = countries.filter(
        (c) => c.region === region && c.subregion === sub
      );
      const subVisited = subCountries.filter((c) =>
        visited.isCountryVisited(c.isoCode)
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
