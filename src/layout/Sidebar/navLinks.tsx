import {
  FaChartSimple,
  FaEarthAmericas,
  FaQuestion,
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
    to: "/quizzes",
    icon: <FaQuestion className="text-2xl" />,
    label: "Quizzes",
  },
  {
    to: "/trips",
    icon: <FaSuitcaseRolling className="text-2xl" />,
    label: "My Trips",
  },
];
