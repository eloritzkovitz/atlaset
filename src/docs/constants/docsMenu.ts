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
        label: "Get started",
        file: "getstarted/get-started.md",
        icon: ICONS.getStarted,
        url: "/docs/getstarted/get-started",
      },
      {
        label: "Creating an account",
        file: "getstarted/creating-an-account.md",
        icon: ICONS.account,
        url: "/docs/getstarted/creating-an-account",
      },
      {
        label: "Your profile",
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
        label: "The map",
        file: "atlas/map.md",
        icon: ICONS.map,
        url: "/docs/atlas/map",
      },
      {
        label: "Customizing your map",
        file: "atlas/customizing-your-map.md",
        icon: ICONS.mapSettings.configuration,
        url: "/docs/atlas/customizing-your-map",
      },
      {
        label: "Countries",
        file: "atlas/countries.md",
        icon: ICONS.countries,
        url: "/docs/atlas/countries",
      },
      {
        label: "Country lists",
        file: "atlas/country-lists.md",
        icon: ICONS.countryLists,
        url: "/docs/atlas/country-lists",
      },
      {
        label: "Layers & markers",
        file: "atlas/layers-markers.md",
        icon: ICONS.location,
        url: "/docs/atlas/layers-markers",
      },
      {
        label: "Saved maps",
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
        label: "Exporting & sharing maps",
        file: "atlas/exporting-sharing-maps.md",
        icon: ICONS.export,
        url: "/docs/atlas/exporting-sharing-maps",
      },
    ],
  },
  explore: {
    header: {
      label: "Explore",
      file: null,
      icon: ICONS.explore,
    },
    items: [
      {
        label: "Overview",
        file: "explore/explore-overview.md",
        icon: ICONS.explore,
        url: "/docs/explore/explore-overview",
      },
      {
        label: "Progress",
        file: "explore/progress.md",
        icon: ICONS.progress,
        url: "/docs/explore/progress",
      },
      {
        label: "Discover",
        file: "explore/discover.md",
        icon: ICONS.discover,
        url: "/docs/explore/discover",
      },
      {
        label: "Languages",
        file: "explore/languages.md",
        icon: ICONS.language,
        url: "/docs/explore/languages",
      },
      {
        label: "Currencies",
        file: "explore/currencies.md",
        icon: ICONS.currencies,
        url: "/docs/explore/currencies",
      },
      {
        label: "Timezones",
        file: "explore/timezones.md",
        icon: ICONS.timezones,
        url: "/docs/explore/timezones",
      },
      {
        label: "Achievements",
        file: "explore/achievements.md",
        icon: ICONS.achievements,
        url: "/docs/explore/achievements",
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
        label: "Overview",
        file: "trips/trips-overview.md",
        icon: ICONS.trips,
        url: "/docs/trips/trips-overview",
      },
      {
        label: "Creating and managing trips",
        file: "trips/creating-managing-trips.md",
        icon: ICONS.tripPlanned,
        url: "/docs/trips/creating-managing-trips",
      },
      {
        label: "Viewing trip details",
        file: "trips/viewing-trip-details.md",
        icon: ICONS.view,
        url: "/docs/trips/viewing-trip-details",
      },
      {
        label: "Destinations",
        file: "trips/destinations.md",
        icon: ICONS.tripLocal,
        url: "/docs/trips/destinations",
      },
      {
        label: "Gallery",
        file: "trips/gallery.md",
        icon: ICONS.photoAlbum,
        url: "/docs/trips/gallery",
      },
      {
        label: "Sharing trips",
        file: "trips/sharing-trips.md",
        icon: ICONS.sharedTrips,
        url: "/docs/trips/sharing-trips",
      },
      {
        label: "Tracking your visits",
        file: "trips/tracking-your-visits.md",
        icon: ICONS.visits,
        url: "/docs/trips/tracking-your-visits",
      },
      {
        label: "Calendar",
        file: "trips/calendar.md",
        icon: ICONS.calendar,
        url: "/docs/trips/calendar",
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
        label: "How to play",
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
  search: {
    header: {
      label: "Search",
      file: null,
      icon: ICONS.search,
    },
    items: [
      {
        label: "Overview",
        file: "search/search-overview.md",
        icon: ICONS.search,
        url: "/docs/search/search-overview",
      },
      {
        label: "Country search",
        file: "search/country-search.md",
        icon: ICONS.search,
        url: "/docs/search/country-search",
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
        label: "Statistics",
        file: "dashboard/statistics.md",
        icon: ICONS.statistics,
        url: "/docs/dashboard/statistics",
      },
    ],
  },
  account: {
    header: {
      label: "Managing your account",
      file: null,
      icon: ICONS.accountManagement,
    },
    items: [
      {
        label: "Account settings",
        file: "account/account-settings.md",
        icon: ICONS.settings,
        url: "/docs/account/account-settings",
      },
      {
        label: "Deleting your account",
        file: "account/deleting-your-account.md",
        icon: ICONS.accountManagement,
        url: "/docs/account/deleting-your-account",
      },
      {
        label: "Privacy settings",
        file: "account/privacy-settings.md",
        icon: ICONS.privacy,
        url: "/docs/account/privacy-settings",
      },
      {
        label: "Security and devices",
        file: "account/security-and-devices.md",
        icon: ICONS.security,
        url: "/docs/account/security-and-devices",
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
        label: "Accessibility settings",
        file: "accessibility/accessibility-settings.md",
        icon: ICONS.accessibility,
        url: "/docs/accessibility/accessibility-settings",
      },
      {
        label: "Keyboard Shortcuts",
        file: "accessibility/keyboard-shortcuts.md",
        icon: ICONS.shortcuts,
        url: "/docs/accessibility/keyboard-shortcuts",
      },
    ],
  },
  forDevelopers: {
    header: { label: "For Developers", file: null, icon: ICONS.code },
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
  ...DOCS_GROUPS.explore.items,
  ...DOCS_GROUPS.trips.items,
  ...DOCS_GROUPS.quizzes.items,
  ...DOCS_GROUPS.search.items,
  ...DOCS_GROUPS.dashboard.items,
  ...DOCS_GROUPS.account.items,
  ...DOCS_GROUPS.accessibility.items,
  ...DOCS_GROUPS.forDevelopers.items,
];
