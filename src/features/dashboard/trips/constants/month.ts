import type { TableColumn } from "@components";
import {
  FaCalendarDays,
  FaLocationDot,
  FaPlane,
  FaSuitcaseRolling,
  FaPercent,
} from "react-icons/fa6";

interface MonthRow {
  name: string;
  local: number;
  abroad: number;
  total: number;
  percentage: number;
}

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

export const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

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
];
