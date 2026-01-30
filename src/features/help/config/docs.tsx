import {
  FaChartSimple,
  FaDatabase,
  FaLaptopCode,
  FaMap,
  FaQuestion,
  FaRocket,
  FaSuitcaseRolling,
} from "react-icons/fa6";

export const DOCS = [
  { label: "Getting Started", file: "getting-started.md", icon: <FaRocket /> },
  { label: "Map Data & Customization", file: "map-data.md", icon: <FaMap /> },
  { label: "Trips", file: "trips.md", icon: <FaSuitcaseRolling /> },
  { label: "Dashboard", file: "dashboard.md", icon: <FaChartSimple /> },
  { label: "Quizzes", file: "quizzes.md", icon: <FaQuestion /> },
];

export const DEV_DOCS = [
  { label: "Developer Guide", file: "developers.md", icon: <FaLaptopCode /> },
  { label: "Data Sources", file: "data-sources.md", icon: <FaDatabase /> },
];

export const DOCS_PATH = "/docs/";
