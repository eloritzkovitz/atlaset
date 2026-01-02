import {
  FaCalendarDays,
  FaClockRotateLeft,
  FaChartPie,
  FaRegCalendarDays,
  FaBookAtlas,
} from "react-icons/fa6";

export const COUNTRIES_SUBMENU = [
  {
    key: "countries/overview",
    label: "Overview",
    icon: <FaBookAtlas />,
  },
];

export const TRIPS_SUBMENU = [
  {
    key: "trips/overview",
    label: "Overview",
    icon: <FaChartPie />,
  },
  {
    key: "trips/history",
    label: "History",
    icon: <FaClockRotateLeft />,
  },
  {
    key: "trips/month",
    label: "By Month",
    icon: <FaCalendarDays />,
  },
  {
    key: "trips/year",
    label: "By Year",
    icon: <FaRegCalendarDays />,
  },
];
