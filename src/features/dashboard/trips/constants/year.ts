import type { TableColumn } from "@components";
import {
  FaCalendarDays,
  FaLocationDot,
  FaPlane,
  FaSuitcaseRolling,
} from "react-icons/fa6";

interface YearRow {
  year: number;
  local: number;
  abroad: number;
  total: number;
}

export const YEAR_TABLE_COLUMNS: TableColumn<YearRow>[] = [
  {
    key: "year",
    label: "Year",
    icon: FaCalendarDays,
    sortable: true,
    render: (row) => row.year.toString(),
  },
  {
    key: "local",
    label: "Local",
    icon: FaLocationDot,
    sortable: true,
    render: (row) => row.local.toLocaleString(),
  },
  {
    key: "abroad",
    label: "Abroad",
    icon: FaPlane,
    sortable: true,
    render: (row) => row.abroad.toLocaleString(),
  },
  {
    key: "total",
    label: "Total",
    icon: FaSuitcaseRolling,
    sortable: true,
    render: (row) => row.total.toLocaleString(),
  },
];
