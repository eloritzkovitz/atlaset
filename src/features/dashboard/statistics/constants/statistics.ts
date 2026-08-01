import type { TableColumn } from "@components";
import { ICONS } from "@constants/icons";
import type { MonthRow, YearRow } from "../types";

export const MONTH_COLORS = [
  "#22d3ee",
  "#6366f1",
  "#818cf8",
  "#a78bfa",
  "#f472b6",
  "#f43f5e",
  "#f87171",
  "#f59e42",
  "#fbbf24",
  "#4ade80",
  "#34d399",
  "#10b981",
] as const;

export const MONTH_TABLE_COLUMNS: TableColumn<MonthRow>[] = [
  {
    key: "name",
    label: "Month",
    labelKey: "statistics.trends.monthly.table.columns.month",
    icon: ICONS.tripUpcoming,
    sortable: true,
  },
  {
    key: "local",
    label: "Local",
    labelKey: "trips:types.local",
    icon: ICONS.tripLocal,
    iconClass: "text-green-400",
    sortable: true,
    render: (row) => row.local.toLocaleString(),
  },
  {
    key: "abroad",
    label: "Abroad",
    labelKey: "trips:types.abroad",
    icon: ICONS.tripAbroad,
    iconClass: "text-purple-400",
    sortable: true,
    render: (row) => row.abroad.toLocaleString(),
  },
  {
    key: "total",
    label: "Total",
    labelKey: "statistics.trends.monthly.table.columns.total",
    icon: ICONS.trips,
    iconClass: "text-blue-400",
    sortable: true,
    render: (row) => row.total.toLocaleString(),
  },
  {
    key: "percentage",
    label: "Percentage",
    labelKey: "statistics.trends.monthly.table.columns.percentage",
    icon: ICONS.tripFilters,
    iconClass: "text-yellow-400",
    sortable: true,
    render: (row) => `${row.percentage.toFixed(1)}%`,
  },
];

export const YEAR_TABLE_COLUMNS: TableColumn<YearRow>[] = [
  {
    key: "year",
    label: "Year",
    labelKey: "statistics.trends.yearly.table.columns.year",
    icon: ICONS.calendar,
    iconClass: "text-gray-400",
    sortable: true,
    render: (row) => row.year.toString(),
  },
  {
    key: "local",
    label: "Local",
    labelKey: "trips:types.local",
    icon: ICONS.tripLocal,
    iconClass: "text-green-400",
    sortable: true,
    render: (row) => row.local.toLocaleString(),
  },
  {
    key: "abroad",
    label: "Abroad",
    labelKey: "trips:types.abroad",
    iconClass: "text-purple-400",
    icon: ICONS.tripAbroad,
    sortable: true,
    render: (row) => row.abroad.toLocaleString(),
  },
  {
    key: "total",
    label: "Total",
    labelKey: "statistics.trends.yearly.table.columns.total",
    icon: ICONS.trips,
    iconClass: "text-blue-400",
    sortable: true,
    render: (row) => row.total.toLocaleString(),
  },
];
