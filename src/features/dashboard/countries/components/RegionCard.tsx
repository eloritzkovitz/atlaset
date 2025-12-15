import { Card } from "@components";
import { percent } from "@utils/number";
import { RegionButton } from "./RegionButton";
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
  return (
    <Card loading={loading} skeletonLines={6}>
      {!loading && (
        <>
          <RegionButton
            icon={regionIcons[region] || defaultRegionIcon}
            label={region}
            stats={`${visited}/${total} (${percent(visited, total)})`}
            onClick={onRegionClick}
            title={`Show all countries in ${region}`}
            className="mb-2 text-2xl" 
            labelClassName="text-2xl"
            statsClassName="text-xl"           
          />
          <div className="ml-2">
            {subregions.map((sub) => (
              <RegionButton
                key={sub.name}
                label={sub.name}
                stats={`${sub.visited}/${sub.total} (${percent(sub.visited, sub.total)})`}
                onClick={() => onSubregionClick?.(sub.name)}
                title={`Show countries in ${sub.name}`}
                className="text-base py-1 px-2"
                labelClassName="text-text"
                statsClassName="text-muted"
              />
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
