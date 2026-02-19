import type { Crumb } from "@components";

// Predefined breadcrumbs for dashboard panels
export const PANEL_BREADCRUMBS: Record<string, Crumb[]> = {
  overview: [
    { label: "Dashboard", key: "dashboard" },
    { label: "Overview", key: "overview" },
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
  "countries/exploration": [
    { label: "Dashboard", key: "dashboard" },
    { label: "Countries", key: "countries/exploration" },
    { label: "Exploration" },
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
