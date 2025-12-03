import { FaChartSimple } from "react-icons/fa6";
import { ErrorMessage, LoadingSpinner } from "@components";
import { useCountryData } from "@contexts/CountryDataContext";
import { getAllRegions, getSubregionsForRegion } from "@features/countries";
import { RegionCard, WorldExplorationCard } from "@features/dashboard";
import { useVisitedCountries } from "@features/visits";

export default function DashboardPage() {
  const { countries, loading, error } = useCountryData();
  const visited = useVisitedCountries();

  // Handle loading and error states
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <ErrorMessage error={error} />
      </div>
    );
  }

  // Calculate stats
  const totalCountries = countries.length;
  const visitedCountries = countries.filter((c) =>
    visited.isCountryVisited(c.isoCode)
  ).length;
  const regions = getAllRegions(countries);

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          <FaChartSimple className="inline mr-2 mb-3" /> Dashboard
        </h1>

        <WorldExplorationCard
          visited={visitedCountries}
          total={totalCountries}
        />

        <div className="grid gap-6 md:grid-cols-2">
          {regions.map((region) => {
            const regionCountries = countries.filter(
              (c) => c.region === region
            );
            const regionVisited = regionCountries.filter((c) =>
              visited.isCountryVisited(c.isoCode)
            ).length;
            const subregions = getSubregionsForRegion(countries, region).map(
              (sub) => {
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
              }
            );

            return (
              <RegionCard
                key={region}
                region={region}
                visited={regionVisited}
                total={regionCountries.length}
                subregions={subregions}
                countries={regionCountries}
                visitedCountryCodes={visited.visitedCountryCodes}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
