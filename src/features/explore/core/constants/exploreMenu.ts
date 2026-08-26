import { ICONS } from "@constants/icons";

export const EXPLORE_MENU = [
  {
    key: "progress",
    label: "Progress",
    icon: ICONS.progress,
    url: "/explore/progress",
  },
  {
    key: "countries",
    label: "Countries",
    icon: ICONS.countries,
    url: "/explore/countries/all",
  },
  {
    key: "languages",
    label: "Languages",
    icon: ICONS.language,
    url: "/explore/languages",
  },
  {
    key: "currencies",
    label: "Currencies",
    icon: ICONS.currencies,
    url: "/explore/currencies",
  },
  {
    key: "timezones",
    label: "Timezones",
    icon: ICONS.timezones,
    url: "/explore/timezones",
  },
  {
    key: "achievements",
    label: "Achievements",
    icon: ICONS.achievements,
    url: "/explore/achievements",
  },
];

export const EXPLORE_URLS = Object.fromEntries(
  EXPLORE_MENU.map((item) => [item.key, item.url]),
) as Record<(typeof EXPLORE_MENU)[number]["key"], string>;
