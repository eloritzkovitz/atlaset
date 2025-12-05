import {
  FaCalendarDays,
  FaClockRotateLeft,
  FaChartPie,
  FaCompass,
  FaRegCalendarDays,
} from "react-icons/fa6";

export const PANEL_BREADCRUMBS: Record<
  string,
  { label: string; key?: string }[]
> = {
  exploration: [
    { label: "Dashboard", key: "exploration" },
    { label: "Exploration", key: "exploration" },
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
    icon: <FaCompass />,
  },
];

export const TRIPS_SUBMENU = [
  {
    key: "trips-overview",
    label: "Overview",
    icon: <FaChartPie />,
  },
  {
    key: "trips-history",
    label: "History",
    icon: <FaClockRotateLeft />,
  },
  {
    key: "trips-month",
    label: "By Month",
    icon: <FaCalendarDays />,
  },
  {
    key: "trips-year",
    label: "By Year",
    icon: <FaRegCalendarDays />,
  },
];
