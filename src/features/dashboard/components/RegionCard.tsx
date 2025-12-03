import { DashboardCard } from "./DashboardCard";
import { percent } from "@utils/number";

interface SubregionStat {
  name: string;
  visited: number;
  total: number;
}

interface RegionCardProps {
  region: string;
  visited: number;
  total: number;
  subregions: SubregionStat[];
}

export function RegionCard({
  region,
  visited,
  total,
  subregions,
}: RegionCardProps) {
  return (
    <DashboardCard>
      <div className="flex items-center mb-2">
        <span className="text-lg font-semibold">{region}</span>
        <span className="ml-auto text-blue-600 dark:text-gray-300 font-bold">
          {visited}/{total} ({percent(visited, total)})
        </span>
      </div>
      <div className="ml-2">
        {subregions.map((sub) => (
          <div key={sub.name} className="flex items-center text-sm mb-1">
            <span className="text-gray-700 dark:text-gray-300">{sub.name}</span>
            <span className="ml-auto text-gray-500 dark:text-gray-400">
              {sub.visited}/{sub.total} ({percent(sub.visited, sub.total)})
            </span>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
