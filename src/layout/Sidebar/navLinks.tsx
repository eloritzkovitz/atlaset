import {
  FaEarthAmericas,
  FaGear,
  FaQuestion,
  FaSuitcaseRolling,
} from "react-icons/fa6";
import { TbLayoutDashboardFilled } from "react-icons/tb";

export const NAV_LINKS = [
  {
    to: "/atlas",
    icon: <FaEarthAmericas className="text-2xl" />,
    label: "Atlas",
    end: true,
  },
  {
    to: "/trips",
    icon: <FaSuitcaseRolling className="text-2xl" />,
    label: "My Trips",
    end: false,
  },
  {
    to: "/dashboard",
    icon: <TbLayoutDashboardFilled className="text-2xl" />,
    label: "Dashboard",
    end: false,
  },
  {
    to: "/quizzes",
    icon: <FaQuestion className="text-2xl" />,
    label: "Quizzes",
    end: false,
  },
];

export const SETTINGS_LINK = {
  to: "/settings",
  icon: <FaGear className="text-2xl" />,
  label: "Settings",
  end: false,
};
