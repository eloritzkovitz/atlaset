import React, { createContext, useContext, useMemo, useState } from "react";
import { useTrips } from "@contexts/TripsContext";
import { getYearsFromTrips } from "@features/visits";
import type { OverlayMode } from "@types";

interface TimelineContextValue {
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
  const { trips } = useTrips();

  // Compute years from trips
  const years = useMemo(() => getYearsFromTrips(trips), [trips]);
  const [selectedYear, setSelectedYear] = useState(
    years[years.length - 1] || new Date().getFullYear()
  );

  // Overlay mode state
  const [overlayMode, setOverlayMode] = useState<OverlayMode>("cumulative");

  const value = useMemo(
    () => ({
      years,
      selectedYear,
      setSelectedYear,
      overlayMode,
      setOverlayMode,
    }),
    [years, selectedYear, overlayMode]
  );

  return (
    <TimelineContext.Provider value={value}>
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
