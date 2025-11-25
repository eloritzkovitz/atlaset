import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTrips } from "@contexts/TripsContext";
import { getYearsFromTrips } from "@features/visits";
import { useKeyHandler } from "@hooks/useKeyHandler";
import type { OverlayMode } from "@types";

interface TimelineContextValue {
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

const TimelineContext = createContext<TimelineContextValue | undefined>(
  undefined
);

export const TimelineProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [timelineMode, setTimelineMode] = useState(false);
  const [showVisitedOnly, setShowVisitedOnly] = useState(false);

  // Compute years from trips
  const { trips } = useTrips();
  const years = useMemo(() => getYearsFromTrips(trips), [trips]);
  const [selectedYear, setSelectedYear] = useState(
    years[years.length - 1] || new Date().getFullYear()
  );

  // Overlay mode state
  const [overlayMode, setOverlayMode] = useState<OverlayMode>("cumulative");

  // Toggle Timeline mode with "T"
  useKeyHandler(() => setTimelineMode((prev) => !prev), ["t", "T"], true);
  
  // Effect to set showVisitedOnly when timelineMode changes
  useEffect(() => {
    setShowVisitedOnly(timelineMode);
  }, [timelineMode]);

  return (
    <TimelineContext.Provider
      value={{
        timelineMode,
        setTimelineMode,
        showVisitedOnly,
        setShowVisitedOnly,
        years,
        selectedYear,
        setSelectedYear,
        overlayMode,
        setOverlayMode,
      }}
    >
      {children}
    </TimelineContext.Provider>
  );
};

// Custom hook to use the TimelineContext
export function useTimeline() {
  const ctx = useContext(TimelineContext);
  if (!ctx)
    throw new Error("useTimeline must be used within a TimelineProvider");
  return ctx;
}
