import type { Crumb } from "@components";

export const DASHBOARD_BREADCRUMBS: Record<string, Crumb[]> = {
  overview: [
    {
      labelKey: "menu.title",
      label: "Dashboard",
      key: "dashboard",
    },
  ],

  statistics: [
    {
      labelKey: "menu.title",
      label: "Dashboard",
      key: "dashboard",
    },
    {
      labelKey: "menu.statistics",
      label: "Statistics",
      key: "statistics",
    },
  ],
};

export const DASHBOARD_URLS = {
  overview: "/dashboard",
  statistics: "/dashboard/statistics",
} as const;
