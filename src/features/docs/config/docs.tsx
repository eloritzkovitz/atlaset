import { FaDraftingCompass } from "react-icons/fa";
import {
  FaBookAtlas,
  FaBookmark,
  FaChartPie,
  FaCircleUser,
  FaCode,
  FaCompass,
  FaDatabase,
  FaEarthAmericas,
  FaGear,
  FaGlobe,
  FaKeyboard,
  FaLaptopCode,
  FaListUl,
  FaMap,
  FaMapLocationDot,
  FaMedal,
  FaQuestion,
  FaRocket,
  FaShareFromSquare,
  FaSuitcaseRolling,
  FaTimeline,
  FaUniversalAccess,
  FaUser,
  FaUserGear,
  FaUserGroup,
} from "react-icons/fa6";
import { TbLayoutDashboardFilled } from "react-icons/tb";

export const DOCS_PATH = "/docs/";

export const DOCS_GROUPS = {
  usingAtlaset: {
    header: { label: "Using Atlaset", file: null, icon: <FaCompass /> },
    items: [
      {
        label: "Getting Started",
        file: "getting-started.md",
        icon: <FaRocket />,
      },
      {
        label: "Creating an Account",
        file: "account.md",
        icon: <FaCircleUser />,
      },
      {
        label: "Your Profile",
        file: "profile.md",
        icon: <FaUser />,
      },
      {
        label: "Friends",
        file: "friends.md",
        icon: <FaUserGroup />,
      },
      { label: "Atlas", file: "atlas.md", icon: <FaEarthAmericas /> },
      { label: "The Map", file: "map.md", icon: <FaMap /> },
      {
        label: "Map Settings",
        file: "map-settings.md",
        icon: <FaDraftingCompass />,
      },
      { label: "Countries", file: "countries.md", icon: <FaGlobe /> },
      {
        label: "Layers & Markers",
        file: "layers-markers.md",
        icon: <FaMapLocationDot />,
      },
      { label: "Legend", file: "legend.md", icon: <FaListUl /> },
      {
        label: "Saved Maps",
        file: "saved-maps.md",
        icon: <FaBookmark />,
      },
      { label: "Timeline", file: "timeline.md", icon: <FaTimeline /> },
      {
        label: "Exporting & Sharing Maps",
        file: "export.md",
        icon: <FaShareFromSquare />,
      },
      { label: "Trips", file: "trips.md", icon: <FaSuitcaseRolling /> },
      {
        label: "Dashboard",
        file: "dashboard.md",
        icon: <TbLayoutDashboardFilled />,
      },
      {
        label: "Exploration",
        file: "exploration.md",
        icon: <FaBookAtlas />,
      },
      {
        label: "Achievements",
        file: "achievements.md",
        icon: <FaMedal />,
      },
      {
        label: "Trip Statistics",
        file: "trip-statistics.md",
        icon: <FaChartPie />,
      },
      { label: "Quizzes", file: "quizzes.md", icon: <FaQuestion /> },
    ],
  },
  account: {
    header: {
      label: "Managing Your Account",
      file: null,
      icon: <FaUserGear />,
    },
    items: [
      {
        label: "Account Settings",
        file: "account-settings.md",
        icon: <FaGear />,
      },
    ],
  },
  accessibility: {
    header: { label: "Accessibility", file: null, icon: <FaUniversalAccess /> },
    items: [
      {
        label: "Keyboard Shortcuts",
        file: "keyboard-shortcuts.md",
        icon: <FaKeyboard />,
      },
    ],
  },
  forDevelopers: {
    header: { label: "For Developers", file: null, icon: <FaCode /> },
    items: [
      {
        label: "Developer Guide",
        file: "developers.md",
        icon: <FaLaptopCode />,
      },
      { label: "Data Sources", file: "data-sources.md", icon: <FaDatabase /> },
    ],
  },
};

export const DOCS = [
  ...DOCS_GROUPS.usingAtlaset.items,
  ...DOCS_GROUPS.accessibility.items,
  ...DOCS_GROUPS.forDevelopers.items,
];

// Cards displayed on the welcome documentation page
export const DOCS_CARDS = [
  {
    icon: <FaRocket className="text-5xl mb-4 text-danger" />,
    title: "Getting Started",
    description: "Learn the basics and set up your Atlaset experience.",
    file: "getting-started.md",
  },
  {
    icon: <FaUser className="text-5xl mb-4 text-code" />,
    title: "Account & Profile",
    description: "Manage your account settings and personalize your profile.",
    file: "account-profile.md",
  },
  {
    icon: <FaEarthAmericas className="text-5xl mb-4 text-info" />,
    title: "Atlas",
    description: "Explore the interactive world map and its features.",
    file: "atlas.md",
  },
  {
    icon: <FaSuitcaseRolling className="text-5xl mb-4 text-primary" />,
    title: "Trips",
    description: "Plan, track and relive your journeys and adventures.",
    file: "trips.md",
  },
  {
    icon: <TbLayoutDashboardFilled className="text-5xl mb-4 text-warning" />,
    title: "Dashboard",
    description: "View your stats and achievements.",
    file: "dashboard.md",
  },
  {
    icon: <FaQuestion className="text-5xl mb-4 text-muted" />,
    title: "Quizzes",
    description: "Test your knowledge of the world.",
    file: "quizzes.md",
  },
];
