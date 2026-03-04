import { ICONS } from "@constants/icons";

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
      icon: <ICONS.exploration className="text-5xl text-info" />,
      link: "/dashboard/exploration",
    },
    {
      label: "Achievements",
      value: achievementsLoading
        ? "..."
        : `${completedCount}/${achievementsCount}`,
      icon: <ICONS.achievements className="text-5xl text-warning" />,
      link: "/dashboard/achievements",
    },
    {
      label: "Statistics",
      value: (
        <span className="flex items-center gap-2">
          View <ICONS.navigate />
        </span>
      ),
      icon: <ICONS.statistics className="text-5xl text-success" />,
      link: "/dashboard/statistics",
    },
  ];
}
