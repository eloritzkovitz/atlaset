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
  currencies: [
    { label: "Dashboard", key: "dashboard" },
    { label: "Currencies", key: "currencies" },
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
  achievements: [
    { label: "Dashboard", key: "dashboard" },
    { label: "Achievements", key: "achievements" },
  ],
  statistics: [
    { label: "Dashboard", key: "dashboard" },
    { label: "Statistics", key: "statistics" },
  ],
};
