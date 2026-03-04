import { ICONS } from "@constants/icons";

export const DOCS_PATH = "/docs/";

export const DOCS_GROUPS = {
  usingAtlaset: {
    header: {
      label: "Using Atlaset",
      file: null,
      icon: <ICONS.usingAtlaset />,
    },
    items: [
      {
        label: "Getting Started",
        file: "getting-started.md",
        icon: <ICONS.gettingStarted />,
      },
      {
        label: "Creating an Account",
        file: "account.md",
        icon: <ICONS.account />,
      },
      {
        label: "Your Profile",
        file: "profile.md",
        icon: <ICONS.profile />,
      },
      {
        label: "Friends",
        file: "friends.md",
        icon: <ICONS.friends />,
      },
      { label: "Atlas", file: "atlas.md", icon: <ICONS.atlas /> },
      { label: "The Map", file: "map.md", icon: <ICONS.map /> },
      {
        label: "Map Settings",
        file: "map-settings.md",
        icon: <ICONS.mapConfig />,
      },
      { label: "Countries", file: "countries.md", icon: <ICONS.countries /> },
      {
        label: "Layers & Markers",
        file: "layers-markers.md",
        icon: <ICONS.mapData />,
      },
      { label: "Legend", file: "legend.md", icon: <ICONS.legend /> },
      {
        label: "Saved Maps",
        file: "saved-maps.md",
        icon: <ICONS.saved />,
      },
      { label: "Timeline", file: "timeline.md", icon: <ICONS.timeline /> },
      {
        label: "Exporting & Sharing Maps",
        file: "export.md",
        icon: <ICONS.export />,
      },
      { label: "Trips", file: "trips.md", icon: <ICONS.trips /> },
      {
        label: "Calendar",
        file: "calendar.md",
        icon: <ICONS.calendar />,
      },
      {
        label: "Dashboard",
        file: "dashboard.md",
        icon: <ICONS.dashboard />,
      },
      {
        label: "Exploration",
        file: "exploration.md",
        icon: <ICONS.exploration />,
      },
      {
        label: "Achievements",
        file: "achievements.md",
        icon: <ICONS.achievements />,
      },
      {
        label: "Statistics",
        file: "statistics.md",
        icon: <ICONS.statistics />,
      },
      { label: "Quizzes", file: "quizzes.md", icon: <ICONS.quizzes /> },
    ],
  },
  account: {
    header: {
      label: "Managing Your Account",
      file: null,
      icon: <ICONS.accountManagement />,
    },
    items: [
      {
        label: "Account Settings",
        file: "account-settings.md",
        icon: <ICONS.settings />,
      },
    ],
  },
  accessibility: {
    header: {
      label: "Accessibility",
      file: null,
      icon: <ICONS.accessibility />,
    },
    items: [
      {
        label: "Keyboard Shortcuts",
        file: "keyboard-shortcuts.md",
        icon: <ICONS.shortcuts />,
      },
    ],
  },
  forDevelopers: {
    header: { label: "For Developers", file: null, icon: <ICONS.developers /> },
    items: [
      {
        label: "Developer Guide",
        file: "developers.md",
        icon: <ICONS.laptopCode />,
      },
      { label: "Data Sources", file: "data-sources.md", icon: <ICONS.data /> },
    ],
  },
};

export const DOCS = [
  ...DOCS_GROUPS.usingAtlaset.items,
  ...DOCS_GROUPS.account.items,
  ...DOCS_GROUPS.accessibility.items,
  ...DOCS_GROUPS.forDevelopers.items,
];

// Cards displayed on the welcome documentation page
export const DOCS_CARDS = [
  {
    icon: <ICONS.gettingStarted className="text-5xl mb-4 text-danger" />,
    title: "Getting Started",
    description: "Learn the basics and set up your Atlaset experience.",
    file: "getting-started.md",
  },
  {
    icon: <ICONS.profile className="text-5xl mb-4 text-code" />,
    title: "Account & Profile",
    description: "Manage your account settings and personalize your profile.",
    file: "account-profile.md",
  },
  {
    icon: <ICONS.atlas className="text-5xl mb-4 text-info" />,
    title: "Atlas",
    description: "Explore the interactive world map and its features.",
    file: "atlas.md",
  },
  {
    icon: <ICONS.trips className="text-5xl mb-4 text-primary" />,
    title: "Trips",
    description: "Plan, track and relive your journeys and adventures.",
    file: "trips.md",
  },
  {
    icon: <ICONS.dashboard className="text-5xl mb-4 text-warning" />,
    title: "Dashboard",
    description: "View your stats and achievements.",
    file: "dashboard.md",
  },
  {
    icon: <ICONS.quizzes className="text-5xl mb-4 text-muted" />,
    title: "Quizzes",
    description: "Test your knowledge of the world.",
    file: "quizzes.md",
  },
];
