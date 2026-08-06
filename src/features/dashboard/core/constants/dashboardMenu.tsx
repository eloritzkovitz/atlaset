import { ICONS } from "@constants/icons";

export const DASHBOARD_MENU = [
  {
    key: "overview",
    label: "Overview",
    icon: ICONS.overview,
    url: "/dashboard/overview",
  },
  {
    key: "exploration",
    label: "Exploration",
    icon: ICONS.exploration,
    url: "/dashboard/exploration",
  },
  {
    key: "countries",
    label: "Countries",
    icon: ICONS.countries,
    url: "/dashboard/countries/all",
  },
  {
    key: "languages",
    label: "Languages",
    icon: ICONS.language,
    url: "/dashboard/languages",
  },
  {
    key: "currencies",
    label: "Currencies",
    icon: ICONS.currencies,
    url: "/dashboard/currencies",
  },
  {
    key: "timezones",
    label: "Timezones",
    icon: ICONS.timezones,
    url: "/dashboard/timezones",
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
