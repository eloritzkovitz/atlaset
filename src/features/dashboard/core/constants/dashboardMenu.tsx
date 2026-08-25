import { ICONS } from "@constants/icons";

export const DASHBOARD_MENU = [
  {
    key: "overview",
    label: "Overview",
    icon: ICONS.overview,
    url: "/dashboard/overview",
  },
  {
    key: "achievements",
    label: "Achievements",
    icon: ICONS.achievements,
    url: "/dashboard/achievements",
  },
  {
    key: "statistics",
    label: "Statistics",
    icon: ICONS.statistics,
    url: "/dashboard/statistics",
  },
];

export const DASHBOARD_URLS = Object.fromEntries(
  DASHBOARD_MENU.map((item) => [item.key, item.url]),
) as Record<(typeof DASHBOARD_MENU)[number]["key"], string>;
