import type { Crumb } from "@components";

export const PANEL_BREADCRUMBS: Record<string, Crumb[]> = {
  progress: [
    { labelKey: "menu.title", label: "Explore", key: "explore" },
    { labelKey: "menu.progress", label: "Progress", key: "progress" },
  ],
  countries: [
    { labelKey: "menu.title", label: "Explore", key: "explore" },
    { labelKey: "menu.countries", label: "Countries", key: "countries" },
  ],
  "countries/all": [
    { labelKey: "menu.title", label: "Explore", key: "explore" },
    { labelKey: "menu.countries", label: "Countries", key: "countries/all" },
    {
      labelKey: "menu.allCountries",
      label: "All Countries",
      key: "countries/all",
    },
  ],
  languages: [
    { labelKey: "menu.title", label: "Explore", key: "explore" },
    { labelKey: "menu.languages", label: "Languages", key: "languages" },
  ],
  currencies: [
    { labelKey: "menu.title", label: "Explore", key: "explore" },
    { labelKey: "menu.currencies", label: "Currencies", key: "currencies" },
  ],
  "currencies/exchange": [
    { labelKey: "menu.title", label: "Explore", key: "explore" },
    { labelKey: "menu.currencies", label: "Currencies", key: "currencies" },
    {
      labelKey: "menu.currencyExchange",
      label: "Currency Exchange",
      key: "currencies/exchange",
    },
  ],
  timezones: [
    { labelKey: "menu.title", label: "Explore", key: "explore" },
    { labelKey: "menu.timezones", label: "Timezones", key: "timezones" },
  ],
  achievements: [
    { labelKey: "menu.title", label: "Explore", key: "explore" },
    {
      labelKey: "menu.achievements",
      label: "Achievements",
      key: "achievements",
    },
  ],
};
