import React, { useEffect, useMemo, useState } from "react";
import { useTrips } from "@contexts/TripsContext";
import type { OverlayMode } from "@features/atlas/overlays";
import { getLatestYear, getYearsFromTrips } from "@features/visits";
import { useKeyHandler } from "@hooks/useKeyHandler";
import { TimelineContext } from "./TimelineContext";

export const TimelineProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [timelineMode, setTimelineMode] = useState(false);
  const [showVisitedOnly, setShowVisitedOnly] = useState(false);

  // Compute years from trips
  const { trips } = useTrips();
  const years = useMemo(() => getYearsFromTrips(trips), [trips]);
  const [selectedYear, setSelectedYear] = useState(getLatestYear(years));

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
