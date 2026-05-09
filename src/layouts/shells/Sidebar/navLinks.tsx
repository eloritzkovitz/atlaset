import { ICONS } from "@constants/icons";

export const NAV_LINKS = [
  {
    to: "/atlas",
    icon: <ICONS.atlas className="text-2xl" />,
    labelKey: "sidebar.atlas",
    label: "Atlas",
    end: true,
  },
  {
    to: "/trips",
    icon: <ICONS.trips className="text-2xl" />,
    labelKey: "sidebar.trips",
    label: "My Trips",
    end: false,
  },
  {
    to: "/dashboard",
    icon: <ICONS.dashboard className="text-2xl" />,
    labelKey: "sidebar.dashboard",
    label: "Dashboard",
    end: false,
  },
  {
    to: "/quizzes",
    icon: <ICONS.quizzes className="text-2xl" />,
    labelKey: "sidebar.quizzes",
    label: "Quizzes",
    end: false,
  },
];

export const SETTINGS_LINK = {
  to: "/settings",
  icon: <ICONS.settings className="text-2xl" />,
  labelKey: "sidebar.settings",
  label: "Settings",
  end: false,
};
