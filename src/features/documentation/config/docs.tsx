import {
  FaChartSimple,
  FaCompass,
  FaDatabase,
  FaEarthAmericas,
  FaGlobe,
  FaLaptopCode,
  FaMapLocationDot,
  FaQuestion,
  FaRocket,
  FaShareFromSquare,
  FaSuitcaseRolling,
  FaTimeline,
  FaUser,
} from "react-icons/fa6";

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
        label: "Account & Profile",
        file: "account-profile.md",
        icon: <FaUser />,
      },
      { label: "Atlas", file: "atlas.md", icon: <FaEarthAmericas /> },
      { label: "Countries", file: "countries.md", icon: <FaGlobe /> },
      {
        label: "Layers & Markers",
        file: "layers-markers.md",
        icon: <FaMapLocationDot />,
      },
      { label: "Timeline", file: "timeline.md", icon: <FaTimeline /> },
      {
        label: "Exporting & Sharing Maps",
        file: "export.md",
        icon: <FaShareFromSquare />,
      },
      { label: "Trips", file: "trips.md", icon: <FaSuitcaseRolling /> },
      { label: "Dashboard", file: "dashboard.md", icon: <FaChartSimple /> },
      { label: "Quizzes", file: "quizzes.md", icon: <FaQuestion /> },
    ],
  },
  forDevelopers: {
    header: { label: "For Developers", file: null, icon: <FaLaptopCode /> },
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
    icon: <FaChartSimple className="text-5xl mb-4 text-warning" />,
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
