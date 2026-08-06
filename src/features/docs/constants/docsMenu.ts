import { ICONS } from "@constants/icons";

export const DOCS_PATH = "/docs/";

export const DOCS_GROUPS = {
  getStarted: {
    header: {
      label: "Get Started",
      file: null,
      icon: ICONS.getStarted,
    },
    items: [
      {
        label: "Get Started",
        file: "getstarted/get-started.md",
        icon: ICONS.getStarted,
        url: "/docs/getstarted/get-started",
      },
      {
        label: "Creating an Account",
        file: "getstarted/creating-an-account.md",
        icon: ICONS.account,
        url: "/docs/getstarted/creating-an-account",
      },
      {
        label: "Your Profile",
        file: "getstarted/profile.md",
        icon: ICONS.profile,
        url: "/docs/getstarted/profile",
      },
      {
        label: "Friends",
        file: "getstarted/friends.md",
        icon: ICONS.friends,
        url: "/docs/getstarted/friends",
      },
    ],
  },
  atlas: {
    header: {
      label: "Atlas",
      file: null,
      icon: ICONS.atlas,
    },
    items: [
      {
        label: "Overview",
        file: "atlas/atlas-overview.md",
        icon: ICONS.atlas,
        url: "/docs/atlas/atlas-overview",
      },
      {
        label: "The Map",
        file: "atlas/map.md",
        icon: ICONS.map,
        url: "/docs/atlas/map",
      },
      {
        label: "Map Settings",
        file: "atlas/map-settings.md",
        icon: ICONS.mapSettings.configuration,
        url: "/docs/atlas/map-settings",
      },
      {
        label: "Countries",
        file: "atlas/countries.md",
        icon: ICONS.countries,
        url: "/docs/atlas/countries",
      },
      {
        label: "Country Lists",
        file: "atlas/country-lists.md",
        icon: ICONS.countryLists,
        url: "/docs/atlas/country-lists",
      },
      {
        label: "Layers & Markers",
        file: "atlas/layers-markers.md",
        icon: ICONS.location,
        url: "/docs/atlas/layers-markers",
      },
      {
        label: "Saved Maps",
        file: "atlas/saved-maps.md",
        icon: ICONS.savedMaps,
        url: "/docs/atlas/saved-maps",
      },
      {
        label: "Legend",
        file: "atlas/legend.md",
        icon: ICONS.legend,
        url: "/docs/atlas/legend",
      },
      {
        label: "Timeline",
        file: "atlas/timeline.md",
        icon: ICONS.timeline,
        url: "/docs/atlas/timeline",
      },
      {
        label: "Exporting & Sharing Maps",
        file: "atlas/export.md",
        icon: ICONS.export,
        url: "/docs/atlas/export",
      },
    ],
  },
  trips: {
    header: {
      label: "Trips",
      file: null,
      icon: ICONS.trips,
    },
    items: [
      {
        label: "Trips",
        file: "trips/trips.md",
        icon: ICONS.trips,
        url: "/docs/trips/trips",
      },
      {
        label: "Your Visits",
        file: "trips/visits.md",
        icon: ICONS.visits,
        url: "/docs/trips/visits",
      },
      {
        label: "Calendar",
        file: "trips/calendar.md",
        icon: ICONS.calendar,
        url: "/docs/trips/calendar",
      },
    ],
  },
  dashboard: {
    header: {
      label: "Dashboard",
      file: null,
      icon: ICONS.dashboard,
    },
    items: [
      {
        label: "Overview",
        file: "dashboard/dashboard-overview.md",
        icon: ICONS.dashboard,
        url: "/docs/dashboard/dashboard-overview",
      },
      {
        label: "Exploration",
        file: "dashboard/exploration.md",
        icon: ICONS.exploration,
        url: "/docs/dashboard/exploration",
      },
      {
        label: "Languages",
        file: "dashboard/languages.md",
        icon: ICONS.language,
        url: "/docs/dashboard/languages",
      },
      {
        label: "Currencies",
        file: "dashboard/currencies.md",
        icon: ICONS.currencies,
        url: "/docs/dashboard/currencies",
      },
      {
        label: "Timezones",
        file: "dashboard/timezones.md",
        icon: ICONS.timezones,
        url: "/docs/dashboard/timezones",
      },
      {
        label: "Achievements",
        file: "dashboard/achievements.md",
        icon: ICONS.achievements,
        url: "/docs/dashboard/achievements",
      },
      {
        label: "Statistics",
        file: "dashboard/statistics.md",
        icon: ICONS.statistics,
        url: "/docs/dashboard/statistics",
      },
    ],
  },
  quizzes: {
    header: {
      label: "Quizzes",
      file: null,
      icon: ICONS.quizzes,
    },
    items: [
      {
        label: "Overview",
        file: "quizzes/quizzes-overview.md",
        icon: ICONS.quizFlag,
        url: "/docs/quizzes/quizzes-overview",
      },
      {
        label: "How to Play",
        file: "quizzes/gameplay.md",
        icon: ICONS.gameplay,
        url: "/docs/quizzes/gameplay",
      },
      {
        label: "Leaderboards",
        file: "quizzes/leaderboards.md",
        icon: ICONS.leaderboards,
        url: "/docs/quizzes/leaderboards",
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
        file: "account/account-settings.md",
        icon: ICONS.settings,
        url: "/docs/account/account-settings",
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
        file: "accessibility/keyboard-shortcuts.md",
        icon: ICONS.shortcuts,
        url: "/docs/accessibility/keyboard-shortcuts",
      },
    ],
  },
  forDevelopers: {
    header: { label: "For Developers", file: null, icon: ICONS.developers },
    items: [
      {
        label: "Developer Guide",
        file: "developers/developer-guide.md",
        icon: ICONS.laptopCode,
        url: "/docs/developers/developer-guide",
      },
      {
        label: "Data Sources",
        file: "developers/data-sources.md",
        icon: ICONS.data,
        url: "/docs/developers/data-sources",
      },
      {
        label: "Adding Country Fields",
        file: "developers/adding-country-fields.md",
        icon: ICONS.scripts,
        url: "/docs/developers/adding-country-fields",
      },
      {
        label: "Data Sync & Updates",
        file: "developers/data-syncing.md",
        icon: ICONS.refresh,
        url: "/docs/developers/data-syncing",
      },
    ],
  },
};

export const DOCS = [
  ...DOCS_GROUPS.getStarted.items,
  ...DOCS_GROUPS.atlas.items,
  ...DOCS_GROUPS.trips.items,
  ...DOCS_GROUPS.dashboard.items,
  ...DOCS_GROUPS.quizzes.items,
  ...DOCS_GROUPS.account.items,
  ...DOCS_GROUPS.accessibility.items,
  ...DOCS_GROUPS.forDevelopers.items,
];
