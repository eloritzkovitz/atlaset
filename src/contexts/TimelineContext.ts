import { createContext, useContext } from "react";
import type { OverlayMode } from "@features/atlas/overlays";

export interface TimelineContextValue {
  timelineMode: boolean;
  setTimelineMode: (v: boolean | ((prev: boolean) => boolean)) => void;
  showVisitedOnly: boolean;
  setShowVisitedOnly: (v: boolean | ((prev: boolean) => boolean)) => void;
  years: number[];
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  overlayMode: OverlayMode;
  setOverlayMode: React.Dispatch<React.SetStateAction<OverlayMode>>;
}

export const TimelineContext = createContext<TimelineContextValue | undefined>(undefined);

export function useTimeline() {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error("useTimeline must be used within a TimelineProvider");
  }
  return context;
}
