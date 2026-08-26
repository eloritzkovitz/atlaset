import type { Crumb } from "@components";

// Predefined breadcrumbs for dashboard panels
export const PANEL_BREADCRUMBS: Record<string, Crumb[]> = {
  overview: [
    { labelKey: "menu.title", label: "Dashboard", key: "dashboard" },
    { labelKey: "menu.overview", label: "Overview", key: "overview" },
  ],
  statistics: [
    { labelKey: "menu.title", label: "Dashboard", key: "dashboard" },
    { labelKey: "menu.statistics", label: "Statistics", key: "statistics" },
  ],
};
