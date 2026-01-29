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
    title: "World Exploration",
    icon: <FaBookAtlas />,
  },
];

export const ACHIEVEMENTS_MENU = [
  {
    key: "achievements",
    label: "Overview",
    title: "Achievements",
    icon: <FaAward />,
  },
];

export const TRIPS_SUBMENU = [
  {
    key: "trips/overview",
    label: "Overview",
    title: "Trips Overview",
    icon: <FaChartPie />,
  },
  {
    key: "trips/history",
    label: "History",
    title: "Trip History",
    icon: <FaClockRotateLeft />,
  },
  {
    key: "trips/month",
    label: "By Month",
    title: "Trips By Month",
    icon: <FaCalendarDays />,
  },
  {
    key: "trips/year",
    label: "By Year",
    title: "Trips By Year",
    icon: <FaRegCalendarDays />,
  },
];
