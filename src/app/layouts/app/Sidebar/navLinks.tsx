import { ICONS } from "@constants/icons";

export const NAV_LINKS = [
  {
    to: "/atlas",
    icon: <ICONS.atlas className="text-2xl" />,
    labelKey: "navigation.sidebar.atlas",
    label: "Atlas",
    end: true,
  },
  {
    to: "/explore",
    icon: <ICONS.exploration className="text-2xl" />,
    labelKey: "navigation.sidebar.explore",
    label: "Explore",
    end: false,
  },
  {
    to: "/trips",
    icon: <ICONS.trips className="text-2xl" />,
    labelKey: "navigation.sidebar.trips",
    label: "My Trips",
    end: false,
  },
  {
    to: "/dashboard",
    icon: <ICONS.dashboard className="text-2xl" />,
    labelKey: "navigation.sidebar.dashboard",
    label: "Dashboard",
    end: false,
  },
  {
    to: "/quizzes",
    icon: <ICONS.quizzes className="text-2xl" />,
    labelKey: "navigation.sidebar.quizzes",
    label: "Quizzes",
    end: false,
  },
];

export const SETTINGS_LINK = {
  to: "/settings",
  icon: <ICONS.settings className="text-2xl" />,
  labelKey: "navigation.sidebar.settings",
  label: "Settings",
  end: false,
};
