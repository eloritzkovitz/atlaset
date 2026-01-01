import { Card } from "@components";
import { useAnimatedNumber } from "@hooks";
import { percent } from "@utils/number";
import { RegionButton } from "./RegionButton";
import { SubregionStatsRow } from "./SubregionStatsRow";
import { regionIcons, defaultRegionIcon } from "../constants/regionIcons";
import type { SubregionStat } from "../../types";

interface RegionCardProps {
  region: string;
  visited: number;
  total: number;
  subregions: SubregionStat[];
  loading?: boolean;
  onRegionClick?: () => void;
  onSubregionClick?: (subregion: string) => void;
}

export function RegionCard({
  region,
  visited,
  total,
  subregions,
  loading = false,
  onRegionClick,
  onSubregionClick,
}: RegionCardProps) {
  const animatedVisited = useAnimatedNumber(visited, 640);

  return (
    <Card loading={loading} skeletonLines={6}>
      {!loading && (
        <>
          <RegionButton
            icon={regionIcons[region] || defaultRegionIcon}
            label={region}
            stats={`${animatedVisited}/${total} (${percent(
              animatedVisited,
              total
            )})`}
            onClick={onRegionClick}
            title={`Show all countries in ${region}`}
            className="mb-2 text-2xl"
            labelClassName="text-2xl"
            statsClassName="text-xl"
          />
          <div className="ml-2">
            {subregions.map((sub) => (
              <SubregionStatsRow
                key={sub.name}
                sub={sub}
                onClick={() => onSubregionClick?.(sub.name)}
              />
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
