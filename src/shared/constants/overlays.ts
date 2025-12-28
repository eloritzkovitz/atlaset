import type { TimelineOverlay } from "@features/atlas/overlays";

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
