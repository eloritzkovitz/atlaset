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
