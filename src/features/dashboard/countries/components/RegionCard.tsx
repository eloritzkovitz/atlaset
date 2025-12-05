import { Card } from "@components";
import { percent } from "@utils/number";
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
          <button
            className="flex items-center mb-2 text-2xl w-full rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 transition cursor-pointer focus:outline-none"
            onClick={onRegionClick}
            title={`Show all countries in ${region}`}
            aria-label={`Show all countries in ${region}`}
          >
            {regionIcons[region] || defaultRegionIcon}
            <span className="text-2xl text-blue-5600 font-semibold">
              {region}
            </span>
            <span className="ml-auto text-xl text-blue-500 font-bold">
              {visited}/{total} ({percent(visited, total)})
            </span>
          </button>
          <div className="ml-2">
            {subregions.map((sub) => (
              <button
                key={sub.name}
                className="flex items-center w-full text-base py-1 px-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition"
                onClick={() => onSubregionClick?.(sub.name)}
                title={`Show countries in ${sub.name}`}
              >
                <span className="text-gray-700 dark:text-gray-300">
                  {sub.name}
                </span>
                <span className="ml-auto text-gray-500 dark:text-gray-400">
                  {sub.visited}/{sub.total} ({percent(sub.visited, sub.total)})
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
