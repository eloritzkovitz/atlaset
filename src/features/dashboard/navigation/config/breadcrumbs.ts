import type { Crumb } from "@components";

// Predefined breadcrumbs for dashboard panels
export const PANEL_BREADCRUMBS: Record<string, Crumb[]> = {
  achievements: [
    { label: "Dashboard", key: "dashboard" },
    { label: "Achievements", key: "achievements" },
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
  statistics: [
    { label: "Dashboard", key: "dashboard" },
    { label: "Statistics", key: "statistics" },
  ],
};
