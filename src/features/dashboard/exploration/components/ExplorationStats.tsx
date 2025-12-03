import { useCountryData } from "@contexts/CountryDataContext";
import { useVisitedCountries } from "@features/visits";
import { RegionCard } from "./RegionCard";
import { WorldExplorationCard } from "./WorldExplorationCard";
import { useExplorationStats } from "../hooks/useExplorationStats";

export function ExplorationStats() {
  const { countries } = useCountryData();
  const visited = useVisitedCountries();

  // Get exploration stats
  const { totalCountries, visitedCountries, regionStats } = useExplorationStats(
    countries,
    visited
  );

  return (
    <>
      <WorldExplorationCard visited={visitedCountries} total={totalCountries} />
      <div className="grid gap-6 md:grid-cols-2">
        {regionStats.map((region) => (
          <RegionCard
            key={region.region}
            region={region.region}
            visited={region.regionVisited}
            total={region.regionCountries.length}
            subregions={region.subregions}
            countries={region.regionCountries}
            visitedCountryCodes={visited.visitedCountryCodes}
          />
        ))}
      </div>
    </>
  );
}
