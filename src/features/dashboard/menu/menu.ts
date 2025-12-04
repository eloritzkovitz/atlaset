export const PANEL_BREADCRUMBS: Record<
  string,
  { label: string; key?: string }[]
> = {
  exploration: [
    { label: "Dashboard", key: "exploration" },
    { label: "Exploration" },
  ],
  "trips-overview": [
    { label: "Dashboard", key: "exploration" },
    { label: "Trips", key: "trips-overview" },
    { label: "Overview" },
  ],
  "trips-history": [
    { label: "Dashboard", key: "exploration" },
    { label: "Trips", key: "trips-overview" },
    { label: "History" },
  ],
  "trips-month": [
    { label: "Dashboard", key: "exploration" },
    { label: "Trips", key: "trips-overview" },
    { label: "By Month" },
  ],
  "trips-year": [
    { label: "Dashboard", key: "exploration" },
    { label: "Trips", key: "trips-overview" },
    { label: "By Year" },
  ],
};

export const EXPLORATION_SUBMENU = [
  {
    key: "exploration",
    label: "Overview",
  },
];

export const TRIPS_SUBMENU = [
  {
    key: "trips-overview",
    label: "Overview",
  },
  {
    key: "trips-history",
    label: "History",
  },
  {
    key: "trips-month",
    label: "By Month",
  },
  {
    key: "trips-year",
    label: "By Year",
  },
];
