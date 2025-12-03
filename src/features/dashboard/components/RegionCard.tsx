import {
  FaCircle,
  FaEarthAfrica,
  FaEarthAmericas,
  FaEarthAsia,
  FaEarthEurope,
  FaEarthOceania,
} from "react-icons/fa6";
import { percent } from "@utils/number";
import { DashboardCard } from "./DashboardCard";

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

// Icons for each region
const regionIcons: Record<string, React.ReactNode> = {
  Africa: <FaEarthAfrica className="mr-3" />,
  Europe: <FaEarthEurope className="mr-3" />,
  Asia: <FaEarthAsia className="mr-3" />,
  Americas: <FaEarthAmericas className="mr-3" />,
  Oceania: <FaEarthOceania className="mr-3" />,
};

export function RegionCard({
  region,
  visited,
  total,
  subregions,
}: RegionCardProps) {
  return (
    <DashboardCard>
      <div className="flex items-center mb-2 text-2xl">
        {regionIcons[region] || <FaCircle className="mr-3" />}
        <span className="text-lg font-semibold">{region}</span>
        <span className="ml-auto text-blue-600 dark:text-gray-300 font-bold">
          {visited}/{total} ({percent(visited, total)})
        </span>
      </div>
      <div className="ml-2">
        {subregions.map((sub) => (
          <div key={sub.name} className="flex items-center text-base mb-1">
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
