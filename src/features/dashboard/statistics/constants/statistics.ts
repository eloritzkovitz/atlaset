import type { TableColumn } from "@components";
import { ICONS } from "@constants/icons";
import type { MonthRow, YearRow } from "../types";

export const MONTH_TABLE_COLUMNS: TableColumn<MonthRow>[] = [
  {
    key: "name",
    label: "Month",
    labelKey: "statistics.months.columns.name",
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
    labelKey: "statistics.months.columns.total",
    icon: ICONS.trips,
    iconClass: "text-blue-400",
    sortable: true,
    render: (row) => row.total.toLocaleString(),
  },
  {
    key: "percentage",
    label: "Percentage",
    labelKey: "statistics.months.columns.percentage",
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
    labelKey: "statistics.year.columns.year",
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
    labelKey: "statistics.year.columns.total",
    icon: ICONS.trips,
    iconClass: "text-blue-400",
    sortable: true,
    render: (row) => row.total.toLocaleString(),
  },
];
