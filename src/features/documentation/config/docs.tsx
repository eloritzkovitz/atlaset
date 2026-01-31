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

export const DOCS_PATH = "/docs/";
