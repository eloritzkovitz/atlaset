import type { TimelineOverlay } from "@types";

export const VISITED_OVERLAY_ID = "visited-countries";

export const DEFAULT_VISITED_OVERLAY: TimelineOverlay = {
  id: VISITED_OVERLAY_ID,
  name: "Visited Countries",
  color: "#00bfff",
  countries: [],
  visible: true,
  tooltip: "Countries visited (synced with trips)",
  timelineEnabled: true,
  timelineSnapshot: true,
};
