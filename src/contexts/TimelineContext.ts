import { createContext, useContext } from "react";
import type { ColorMode } from "@features/atlas/layers";

export interface TimelineContextValue {
  timelineMode: boolean;
  setTimelineMode: (v: boolean | ((prev: boolean) => boolean)) => void;
  showVisitedOnly: boolean;
  setShowVisitedOnly: (v: boolean | ((prev: boolean) => boolean)) => void;
  years: number[];
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  colorMode: ColorMode;
  setColorMode: React.Dispatch<React.SetStateAction<ColorMode>>;
}

export const TimelineContext = createContext<TimelineContextValue | undefined>(undefined);

export function useTimeline() {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error("useTimeline must be used within a TimelineProvider");
  }
  return context;
}
