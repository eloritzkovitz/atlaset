import type { Overlay, TimelineOverlay } from "../../features/atlas/overlays";

export const mockOverlays: Overlay[] = [
  {
    id: "1",
    name: "Mock Overlay 1",
    color: "#ff0000",
    countries: ["US", "CA"],
    visible: true,
    order: 1,
    tooltip: "First mock overlay",
  },
  {
    id: "2",
    name: "Mock Overlay 2",
    color: "#00ff00",
    countries: ["FR"],
    visible: false,
    order: 2,
    tooltip: "Second mock overlay",
  },
];

export const mockTimelineOverlay: TimelineOverlay = {
  id: "timeline",
  name: "Timeline Overlay",
  color: "#0000ff",
  countries: ["DE", "JP"],
  visible: true,
  order: 3,
  timelineEnabled: true,
  timelineSnapshot: false,
  tooltip: "Timeline overlay",
};
