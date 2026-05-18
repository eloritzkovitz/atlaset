import { SegmentedToggle } from "@components";
import { useCountryData } from "@features/countries";
import { useDelayedLoading } from "@hooks";
import { RegionCard } from "./RegionCard";
import { WorldExplorationCard } from "./WorldExplorationCard";
import type { RegionStat } from "../types";

interface ExplorationOverviewGridProps {
  visitedCountries: number;
  totalCountries: number;
  regionStats: RegionStat[];
  selectedShowSovereignOnly: boolean;
  setSelectedShowSovereignOnly: (v: boolean) => void;
  setSelectedRegion: (region: string) => void;
  setSelectedSubregion: (subregion: string) => void;
  onSubregionChange?: (region: string, subregion: string) => void;
  onShowAllCountries: () => void;
}

export function ExplorationOverviewGrid({
  visitedCountries,
  totalCountries,
  regionStats,
  selectedShowSovereignOnly,
  setSelectedShowSovereignOnly,
  setSelectedRegion,
  setSelectedSubregion,
  onSubregionChange,
  onShowAllCountries,
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
        value={selectedShowSovereignOnly ? "sovereign" : "all"}
        options={[
          { value: "all", label: "All Countries" },
          { value: "sovereign", label: "Sovereign Only" },
        ]}
        onChange={(v) => setSelectedShowSovereignOnly(v === "sovereign")}
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
