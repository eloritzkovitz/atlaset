import type { Crumb } from "@components";

// Predefined breadcrumbs for dashboard panels
export const PANEL_BREADCRUMBS: Record<string, Crumb[]> = {
  overview: [
    { label: "Dashboard", key: "dashboard" },
    { label: "Overview", key: "overview" },
  ],
  exploration: [
    { label: "Dashboard", key: "dashboard" },
    { label: "Exploration", key: "exploration" },
  ],  
  countries: [
    { label: "Dashboard", key: "dashboard" },
    { label: "Countries", key: "countries" },
  ],
  "countries/all": [
    { label: "Dashboard", key: "dashboard" },
    { label: "Countries", key: "countries/all" },
    { label: "All Countries" },
  ],
  currencies: [
    { label: "Dashboard", key: "dashboard" },
    { label: "Currencies", key: "currencies" },
  ],
  "currencies/exchange": [
    { label: "Dashboard", key: "dashboard" },
    { label: "Currencies", key: "currencies" },
    { label: "Currency Exchange", key: "currencies/exchange" },
  ],
  achievements: [
    { label: "Dashboard", key: "dashboard" },
    { label: "Achievements", key: "achievements" },
  ],
  statistics: [
    { label: "Dashboard", key: "dashboard" },
    { label: "Statistics", key: "statistics" },
  ],
};
