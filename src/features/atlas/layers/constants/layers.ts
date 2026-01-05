import type { AnyLayer, TimelineLayer } from "../types";

export const VISITED_LAYER_ID = "visited-countries";

export const DEFAULT_VISITED_LAYER: TimelineLayer = {
  id: VISITED_LAYER_ID,
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

export const DEFAULT_NEW_LAYER: AnyLayer = {
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
