import { ICONS } from "@constants/icons";

export const NAV_LINKS = [
  {
    to: "/atlas",
    icon: <ICONS.atlas className="text-2xl" />,
    label: "Atlas",
    end: true,
  },
  {
    to: "/trips",
    icon: <ICONS.trips className="text-2xl" />,
    label: "My Trips",
    end: false,
  },
  {
    to: "/dashboard",
    icon: <ICONS.dashboard className="text-2xl" />,
    label: "Dashboard",
    end: false,
  },
  {
    to: "/quizzes",
    icon: <ICONS.quizzes className="text-2xl" />,
    label: "Quizzes",
    end: false,
  },
];

export const SETTINGS_LINK = {
  to: "/settings",
  icon: <ICONS.settings className="text-2xl" />,
  label: "Settings",
  end: false,
};
