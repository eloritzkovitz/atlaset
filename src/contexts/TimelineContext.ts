import { createContext, useContext } from "react";

export interface TimelineContextValue {
  timelineMode: boolean;
  setTimelineMode: (v: boolean | ((prev: boolean) => boolean)) => void;
  years: number[];
  selectedYear: number;
  setSelectedYear: (year: number) => void;
}

export const TimelineContext = createContext<TimelineContextValue | undefined>(
  undefined,
);

export function useTimeline() {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error("useTimeline must be used within a TimelineProvider");
  }
  return context;
}
