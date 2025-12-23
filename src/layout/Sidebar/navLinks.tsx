import {
  FaChartSimple,
  FaEarthAmericas,
  FaGamepad,
  FaSuitcaseRolling,
} from "react-icons/fa6";

export const NAV_LINKS = [
  {
    to: "/",
    icon: <FaEarthAmericas className="text-2xl" />,
    label: "Atlas",
    end: true,
  },
  {
    to: "/dashboard",
    icon: <FaChartSimple className="text-2xl" />,
    label: "Dashboard",
  },
  {
    to: "/game",
    icon: <FaGamepad className="text-2xl" />,
    label: "Games",
    end: true,
  },
  {
    to: "/trips",
    icon: <FaSuitcaseRolling className="text-2xl" />,
    label: "My Trips",
    end: true,
  },
];
