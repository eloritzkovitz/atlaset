import type { AnyOverlay, TimelineOverlay } from "../types";

export const VISITED_OVERLAY_ID = "visited-countries";

export const DEFAULT_VISITED_OVERLAY: TimelineOverlay = {
  id: VISITED_OVERLAY_ID,
  name: "Visited Countries",
  color: "#00bfff",
  countries: [],
  visible: true,
  filterLabels: {
    all: "All",
    only: "Visited",
    exclude: "Not Visited",
  },
  timelineEnabled: true,
  timelineSnapshot: true,
};

export const DEFAULT_NEW_OVERLAY: AnyOverlay = {
  id: "",
  name: "",
  color: "#2563eb",
  countries: [],
  filterLabels: {
    all: "All",
    only: "Include only",
    exclude: "Exclude",
  },
  visible: true,
};
