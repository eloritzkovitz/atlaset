import { ICONS } from "@constants/icons";

export const DOCS_PATH = "/docs/";

export const DOCS_GROUPS = {
  usingAtlaset: {
    header: {
      label: "Using Atlaset",
      file: null,
      icon: ICONS.usingAtlaset,
    },
    items: [
      {
        label: "Getting Started",
        file: "getting-started.md",
        icon: ICONS.gettingStarted,
        url: "/docs/getting-started",
      },
      {
        label: "Creating an Account",
        file: "account.md",
        icon: ICONS.account,
        url: "/docs/account",
      },
      {
        label: "Your Profile",
        file: "profile.md",
        icon: ICONS.profile,
        url: "/docs/profile",
      },
      {
        label: "Friends",
        file: "friends.md",
        icon: ICONS.friends,
        url: "/docs/friends",
      },
      {
        label: "Atlas",
        file: "atlas.md",
        icon: ICONS.atlas,
        url: "/docs/atlas",
      },
      {
        label: "The Map",
        file: "map.md",
        icon: ICONS.map,
        url: "/docs/map",
      },
      {
        label: "Map Settings",
        file: "map-settings.md",
        icon: ICONS.mapConfig,
        url: "/docs/map-settings",
      },
      {
        label: "Countries",
        file: "countries.md",
        icon: ICONS.countries,
        url: "/docs/countries",
      },
      {
        label: "Layers & Markers",
        file: "layers-markers.md",
        icon: ICONS.mapData,
        url: "/docs/layers-markers",
      },
      {
        label: "Legend",
        file: "legend.md",
        icon: ICONS.legend,
        url: "/docs/legend",
      },
      {
        label: "Saved Maps",
        file: "saved-maps.md",
        icon: ICONS.saved,
        url: "/docs/saved-maps",
      },
      {
        label: "Timeline",
        file: "timeline.md",
        icon: ICONS.timeline,
        url: "/docs/timeline",
      },
      {
        label: "Exporting & Sharing Maps",
        file: "export.md",
        icon: ICONS.export,
        url: "/docs/export",
      },
      {
        label: "Trips",
        file: "trips.md",
        icon: ICONS.trips,
        url: "/docs/trips",
      },
      {
        label: "Calendar",
        file: "calendar.md",
        icon: ICONS.calendar,
        url: "/docs/calendar",
      },
      {
        label: "Dashboard",
        file: "dashboard.md",
        icon: ICONS.dashboard,
        url: "/docs/dashboard",
      },
      {
        label: "Exploration",
        file: "exploration.md",
        icon: ICONS.exploration,
        url: "/docs/exploration",
      },
      {
        label: "Currencies",
        file: "currencies.md",
        icon: ICONS.currencies,
        url: "/docs/currencies",
      },
      {
        label: "Achievements",
        file: "achievements.md",
        icon: ICONS.achievements,
        url: "/docs/achievements",
      },
      {
        label: "Quizzes",
        file: "quizzes.md",
        icon: ICONS.quizzes,
        url: "/docs/quizzes",
      },
    ],
  },
  account: {
    header: {
      label: "Managing Your Account",
      file: null,
      icon: ICONS.accountManagement,
    },
    items: [
      {
        label: "Account Settings",
        file: "account-settings.md",
        icon: ICONS.settings,
        url: "/docs/account-settings",
      },
    ],
  },
  accessibility: {
    header: {
      label: "Accessibility",
      file: null,
      icon: ICONS.accessibility,
    },
    items: [
      {
        label: "Keyboard Shortcuts",
        file: "keyboard-shortcuts.md",
        icon: ICONS.shortcuts,
        url: "/docs/keyboard-shortcuts",
      },
    ],
  },
  forDevelopers: {
    header: { label: "For Developers", file: null, icon: ICONS.developers },
    items: [
      {
        label: "Developer Guide",
        file: "developers.md",
        icon: ICONS.laptopCode,
        url: "/docs/developers",
      },
      {
        label: "Data Sources",
        file: "data-sources.md",
        icon: ICONS.data,
        url: "/docs/data-sources",
      },
    ],
  },
};

export const DOCS = [
  ...DOCS_GROUPS.usingAtlaset.items,
  ...DOCS_GROUPS.account.items,
  ...DOCS_GROUPS.accessibility.items,
  ...DOCS_GROUPS.forDevelopers.items,
];
