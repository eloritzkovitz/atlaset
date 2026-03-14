import { SegmentedToggle } from "@components";
import { useCountryData } from "@features/countries";
import { useDelayedLoading } from "@hooks";
import { RegionCard } from "./RegionCard";
import { WorldExplorationCard } from "./WorldExplorationCard";
import type { CountryType, RegionStat } from "../types";

interface ExplorationOverviewGridProps {
  countryType: CountryType;
  setCountryType: (type: CountryType) => void;
  visitedCountries: number;
  totalCountries: number;
  onShowAllCountries: () => void;
  regionStats: RegionStat[];
  setSelectedRegion: (region: string) => void;
  setSelectedSubregion: (subregion: string) => void;
  onSubregionChange?: (region: string, subregion: string) => void;
}

export function ExplorationOverviewGrid({
  countryType,
  setCountryType,
  visitedCountries,
  totalCountries,
  onShowAllCountries,
  regionStats,
  setSelectedRegion,
  setSelectedSubregion,
  onSubregionChange,
}: ExplorationOverviewGridProps) {
  const { countries, loading: countriesLoading } = useCountryData();

  // Compute loading state with a slight delay to prevent flickering
  const loading = useDelayedLoading(
    countriesLoading || !countries.length,
    [countries.length],
    50,
  );

  return (
    <>
      <SegmentedToggle
        value={countryType}
        options={[
          { value: "all", label: "All Countries" },
          { value: "sovereign", label: "Sovereign Only" },
        ]}
        onChange={setCountryType}
        className="mb-4"
      />
      <div className="w-full grid gap-6 md:grid-cols-2">
        <WorldExplorationCard
          visited={visitedCountries}
          total={totalCountries}
          loading={loading}
          onShowAllCountries={onShowAllCountries}
        />
        {regionStats.map((region) => (
          <RegionCard
            key={region.region}
            region={region.region}
            visited={region.regionVisited}
            total={region.regionCountries.length}
            subregions={region.subregions}
            loading={loading}
            onRegionClick={() => {
              setSelectedRegion(region.region);
              setSelectedSubregion("");
            }}
            onSubregionClick={(sub) => {
              setSelectedRegion(region.region);
              setSelectedSubregion(sub);
              if (onSubregionChange) {
                onSubregionChange(region.region, sub);
              }
            }}
          />
        ))}
      </div>
    </>
  );
}
