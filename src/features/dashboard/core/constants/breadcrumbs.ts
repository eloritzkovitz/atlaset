import type { Crumb } from "@components";

// Predefined breadcrumbs for dashboard panels
export const PANEL_BREADCRUMBS: Record<string, Crumb[]> = {
  overview: [
    { labelKey: "menu.title", label: "Dashboard", key: "dashboard" },
    { labelKey: "menu.overview", label: "Overview", key: "overview" },
  ],
  exploration: [
    { labelKey: "menu.title", label: "Dashboard", key: "dashboard" },
    { labelKey: "menu.exploration", label: "Exploration", key: "exploration" },
  ],
  countries: [
    { labelKey: "menu.title", label: "Dashboard", key: "dashboard" },
    { labelKey: "menu.countries", label: "Countries", key: "countries" },
  ],
  "countries/all": [
    { labelKey: "menu.title", label: "Dashboard", key: "dashboard" },
    { labelKey: "menu.countries", label: "Countries", key: "countries/all" },
    {
      labelKey: "menu.allCountries",
      label: "All Countries",
      key: "countries/all",
    },
  ],
  languages: [
    { labelKey: "menu.title", label: "Dashboard", key: "dashboard" },
    { labelKey: "menu.languages", label: "Languages", key: "languages" },
  ],
  currencies: [
    { labelKey: "menu.title", label: "Dashboard", key: "dashboard" },
    { labelKey: "menu.currencies", label: "Currencies", key: "currencies" },
  ],
  "currencies/exchange": [
    { labelKey: "menu.title", label: "Dashboard", key: "dashboard" },
    { labelKey: "menu.currencies", label: "Currencies", key: "currencies" },
    {
      labelKey: "menu.currencyExchange",
      label: "Currency Exchange",
      key: "currencies/exchange",
    },
  ],
  timezones: [
    { labelKey: "menu.title", label: "Dashboard", key: "dashboard" },
    { labelKey: "menu.timezones", label: "Timezones", key: "timezones" },
  ],
  achievements: [
    { labelKey: "menu.title", label: "Dashboard", key: "dashboard" },
    {
      labelKey: "menu.achievements",
      label: "Achievements",
      key: "achievements",
    },
  ],
  statistics: [
    { labelKey: "menu.title", label: "Dashboard", key: "dashboard" },
    { labelKey: "menu.statistics", label: "Statistics", key: "statistics" },
  ],
};
