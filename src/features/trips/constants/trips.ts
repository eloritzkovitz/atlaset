import { ICONS } from "@constants/icons";

export const ALL_TRIP_CATEGORIES = [
  "solo",
  "couple",
  "family",
  "group",
  "organized",
  "business",
  "educational",
  "volunteering",
  "religious",
  "adventure",
  "nature",
  "backpacking",
  "roadtrip",
  "cruise",
  "luxury",
  "honeymoon",
  "wellness",
  "local",
  "food",
  "festival",
  "sports",
  "shopping",
  "beach",
  "skiing",
  "snowboarding",
  "extreme",
  "wildlife",
  "historical",
  "architectural",
  "cultural",
  "other",
] as const;

export const ALL_TRIP_STATUSES = [
  "planned",
  "upcoming",
  "in-progress",
  "completed",
  "cancelled",
] as const;

export const ALL_TRIP_TAGS = [
  "beach",
  "mountain",
  "city",
  "roadtrip",
  "nature",
  "culture",
  "food",
  "festival",
  "wildlife",
  "hiking",
  "skiing",
  "snowboarding",
  "adventure",
  "relaxation",
  "shopping",
  "historical",
  "photography",
  "family",
  "luxury",
  "budget",
  "island",
  "desert",
  "forest",
  "national-park",
  "cruise",
  "sports",
  "wellness",
  "spa",
  "art",
  "music",
  "nightlife",
  "camping",
  "fishing",
  "cycling",
  "diving",
  "surfing",
  "safari",
  "volunteering",
  "business",
  "romantic",
  "honeymoon",
  "local",
  "shopping",
  "architecture",
  "religious",
  "extreme",
  "other",
] as const;

export const TRIP_TYPE_COLORS = ["#22d3ee", "#a78bfa"];
export const TRIP_TYPE_LABELS = ["Local", "Abroad"];
export const TRIP_TYPE_ICONS = [ICONS.tripLocal, ICONS.tripAbroad];
export const TRIP_TYPE_COLOR_CLASSES = [  
  "bg-cyan-400/60 text-cyan-100 hover:bg-cyan-400/80",
  "bg-purple-400/60 text-purple-100 hover:bg-purple-400/80",
];

export const TRIP_STATUS_COLORS = ["#f59e42", "#fde047", "#4ade80"];
export const TRIP_STATUS_LABELS = ["Planned", "Upcoming", "Completed"];
export const TRIP_STATUS_ICONS = [ICONS.tripPlanned, ICONS.tripUpcoming, ICONS.tripCompleted];
export const TRIP_STATUS_COLOR_CLASSES = [
  "bg-orange-400/60 text-orange-100 hover:bg-orange-400/80",
  "bg-yellow-400/60 text-yellow-100 hover:bg-yellow-400/80",
  "bg-green-400/60 text-green-100 hover:bg-green-400/80",
];

export const RATING_OPTIONS = [
  { value: -1, label: "All ratings" },
  { value: 5, label: "5 stars" },
  { value: 4.5, label: "4.5 stars" },
  { value: 4, label: "4 stars" },
  { value: 3.5, label: "3.5 stars" },
  { value: 3, label: "3 stars" },
  { value: 2.5, label: "2.5 stars" },
  { value: 2, label: "2 stars" },
  { value: 1.5, label: "1.5 stars" },
  { value: 1, label: "1 star" },
  { value: 0.5, label: "0.5 stars" },
  { value: 0, label: "No rating" },
];

export const RATING_OPTIONS_NO_ALL = RATING_OPTIONS.filter(
  (opt) => opt.value !== -1
);

export const RATING_ACTION_OPTIONS = [
  ...RATING_OPTIONS_NO_ALL.filter((opt) => opt.value !== 0),
  { value: undefined, label: "No rating" },
];
