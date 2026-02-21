import {
  FaBookAtlas,
  FaMedal,
  FaChartSimple,
  FaArrowRight,
} from "react-icons/fa6";

export interface StatsConfigArgs {
  countriesLoading: boolean;
  visitedCountries: number;
  totalCountries: number;
  achievementsLoading: boolean;
  completedCount: number;
  achievementsCount: number;
}

/** Gets the stats configuration for the overview grid. */
export function getStatsConfig({
  countriesLoading,
  visitedCountries,
  totalCountries,
  achievementsLoading,
  completedCount,
  achievementsCount,
}: StatsConfigArgs) {
  return [
    {
      label: "Countries Explored",
      value: countriesLoading ? "..." : `${visitedCountries}/${totalCountries}`,
      icon: <FaBookAtlas className="text-5xl text-info" />,
      link: "/dashboard/exploration",
    },
    {
      label: "Achievements",
      value: achievementsLoading
        ? "..."
        : `${completedCount}/${achievementsCount}`,
      icon: <FaMedal className="text-5xl text-warning" />,
      link: "/dashboard/achievements",
    },
    {
      label: "Statistics",
      value: (
        <span className="flex items-center gap-2">
          View <FaArrowRight />
        </span>
      ),
      icon: <FaChartSimple className="text-5xl text-success" />,
      link: "/dashboard/statistics",
    },
  ];
}
