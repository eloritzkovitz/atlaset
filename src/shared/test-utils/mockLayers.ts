import type { Layer, TimelineLayer } from "../../features/atlas/layers";

export const mockLayers: Layer[] = [
  {
    id: "1",
    name: "Mock Layer 1",
    color: "#ff0000",
    countries: ["US", "CA"],
    visible: true,
    order: 1,
  },
  {
    id: "2",
    name: "Mock Layer 2",
    color: "#00ff00",
    countries: ["FR"],
    visible: false,
    order: 2,
  },
];

export const mockTimelineLayer: TimelineLayer = {
  id: "timeline",
  name: "Timeline Layer",
  color: "#0000ff",
  countries: ["DE", "JP"],
  visible: true,
  order: 3,
  timelineEnabled: true,
  timelineSnapshot: false,
};
