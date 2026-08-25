import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SegmentedToggle, SortSelect } from "@components";
import { useCountryData } from "@features/countries";
import { useDelayedLoading, useLocalStorageState } from "@hooks";
import type { SortValue } from "@types";
import { RegionCard } from "./RegionCard";
import { WorldExplorationCard } from "./WorldExplorationCard";
import type { RegionStat } from "../types";

type ExplorationSortKey = "name" | "progress";

interface ExploreOverviewGridProps {
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

export function ExploreOverviewGrid({
  visitedCountries,
  totalCountries,
  regionStats,
  selectedShowSovereignOnly,
  setSelectedShowSovereignOnly,
  setSelectedRegion,
  setSelectedSubregion,
  onSubregionChange,
  onShowAllCountries,
}: ExploreOverviewGridProps) {
  const { countries, loading: countriesLoading } = useCountryData();
  const { t } = useTranslation("explore");

  const [sortValue, setSortValue] = useLocalStorageState<
    SortValue<ExplorationSortKey>
  >("atlaset:world_exploration_sort", "name-asc");

  // Compute loading state with a slight delay to prevent flickering
  const loading = useDelayedLoading(
    countriesLoading || !countries.length,
    [countries.length],
    50,
  );

  // Handle sorting of region stats directly off the composite sortValue string
  const sortedRegionStats = useMemo(() => {
    return [...regionStats].sort((a, b) => {
      if (sortValue.startsWith("progress")) {
        const percentA = a.regionCountries.length
          ? a.regionVisited / a.regionCountries.length
          : 0;
        const percentB = b.regionCountries.length
          ? b.regionVisited / b.regionCountries.length
          : 0;
        return sortValue.endsWith("asc")
          ? percentA - percentB
          : percentB - percentA;
      }

      return sortValue.endsWith("asc")
        ? a.region.localeCompare(b.region)
        : b.region.localeCompare(a.region);
    });
  }, [regionStats, sortValue]);

  return (
    <>
      <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
        <SegmentedToggle
          value={selectedShowSovereignOnly ? "sovereign" : "all"}
          options={[
            {
              value: "all",
              label: t("overview.toggles.all", "All Countries"),
            },
            {
              value: "sovereign",
              label: t("overview.toggles.sovereign", "Sovereign Only"),
            },
          ]}
          onChange={(v) => setSelectedShowSovereignOnly(v === "sovereign")}
          className="mb-0"
        />

        <SortSelect
          value={sortValue}
          onChange={setSortValue}
          keyGroup={[
            {
              value: "name",
              label: t("overview.sortBy.alphabetical", "Alphabetical"),
            },
            {
              value: "progress",
              label: t("overview.sortBy.progress", "Progress"),
            },
          ]}
          showLabel
        />
      </div>

      <div className="w-full grid gap-6 md:grid-cols-2">
        <WorldExplorationCard
          visited={visitedCountries}
          total={totalCountries}
          loading={loading}
          onShowAllCountries={onShowAllCountries}
        />
        {sortedRegionStats.map((region) => (
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
