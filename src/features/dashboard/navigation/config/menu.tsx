import {
  FaCalendarDays,
  FaClockRotateLeft,
  FaChartPie,
  FaRegCalendarDays,
  FaBookAtlas,
  FaAward,
} from "react-icons/fa6";

export const COUNTRIES_SUBMENU = [
  {
    key: "countries/exploration",
    label: "Exploration",
    icon: <FaBookAtlas />,
  },
];

export const ACHIEVEMENTS_MENU = [
  {
    key: "achievements",
    label: "Overview",
    icon: <FaAward />,
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
