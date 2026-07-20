import { ICONS } from "@constants/icons";
import {
  ABROAD_TRIP_COLOR,
  LOCAL_TRIP_COLOR,
  PLANNED_VISIT_COLOR,
  UPCOMING_VISIT_COLOR,
  VISITED_COLOR,
} from "@constants/colors";
import type { TripStatus } from "../types";

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

export const TRIP_TYPE_COLORS = [LOCAL_TRIP_COLOR, ABROAD_TRIP_COLOR];
export const TRIP_TYPE_LABELS = ["Local", "Abroad"];
export const TRIP_TYPE_ICONS = [ICONS.tripLocal, ICONS.tripAbroad];
export const TRIP_TYPE_COLOR_CLASSES = [
  "bg-type-local/90 hover:bg-type-local",
  "bg-type-abroad/90 hover:bg-type-abroad",
];

export const TRIP_STATUS_COLORS = [
  PLANNED_VISIT_COLOR,
  UPCOMING_VISIT_COLOR,
  VISITED_COLOR,
];
export const TRIP_STATUS_LABELS = ["Planned", "Upcoming", "Completed"];
export const TRIP_STATUS_ICONS = [
  ICONS.tripPlanned,
  ICONS.tripUpcoming,
  ICONS.tripCompleted,
];
export const TRIP_STATUS_COLOR_CLASSES: Record<TripStatus, string> = {
  planned: "bg-status-planned/90 hover:bg-status-planned",
  upcoming: "bg-status-upcoming/90 hover:bg-status-upcoming",
  "in-progress": "bg-status-inprogress/90 hover:bg-status-inprogress",
  completed: "bg-status-completed/90 hover:bg-status-completed",
  cancelled: "bg-status-cancelled/90 hover:bg-status-cancelled",
};
