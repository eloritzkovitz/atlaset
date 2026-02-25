import {
  FaCalendarDays,
  FaLocationDot,
  FaPlane,
  FaSuitcaseRolling,
  FaPercent,
  FaRegCalendarDays,
} from "react-icons/fa6";
import type { TableColumn } from "@components";
import type { MonthRow, YearRow } from "../types";

export const MONTH_TABLE_COLUMNS: TableColumn<MonthRow>[] = [
  {
    key: "name",
    label: "Month",
    icon: FaCalendarDays,
    sortable: true,
  },
  {
    key: "local",
    label: "Local",
    icon: FaLocationDot,
    iconClass: "text-green-400",
    sortable: true,
    render: (row) => row.local.toLocaleString(),
  },
  {
    key: "abroad",
    label: "Abroad",
    icon: FaPlane,
    iconClass: "text-purple-400",
    sortable: true,
    render: (row) => row.abroad.toLocaleString(),
  },
  {
    key: "total",
    label: "Total",
    icon: FaSuitcaseRolling,
    iconClass: "text-blue-400",
    sortable: true,
    render: (row) => row.total.toLocaleString(),
  },
  {
    key: "percentage",
    label: "Percentage",
    icon: FaPercent,
    iconClass: "text-yellow-400",
    sortable: true,
    render: (row) => `${row.percentage.toFixed(1)}%`,
  },
];

export const YEAR_TABLE_COLUMNS: TableColumn<YearRow>[] = [
  {
    key: "year",
    label: "Year",
    icon: FaRegCalendarDays,
    iconClass: "text-gray-400",
    sortable: true,
    render: (row) => row.year.toString(),
  },
  {
    key: "local",
    label: "Local",
    icon: FaLocationDot,
    iconClass: "text-green-400",
    sortable: true,
    render: (row) => row.local.toLocaleString(),
  },
  {
    key: "abroad",
    label: "Abroad",
    iconClass: "text-purple-400",
    icon: FaPlane,
    sortable: true,
    render: (row) => row.abroad.toLocaleString(),
  },
  {
    key: "total",
    label: "Total",
    icon: FaSuitcaseRolling,
    iconClass: "text-blue-400",
    sortable: true,
    render: (row) => row.total.toLocaleString(),
  },
];
