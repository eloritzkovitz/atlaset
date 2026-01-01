import React, { useEffect, useMemo, useState, useRef } from "react";
import { useTrips } from "@contexts/TripsContext";
import type { OverlayMode } from "@features/atlas/overlays";
import { useAudio } from "@contexts/AudioContext";
import { getLatestYear, getYearsFromTrips } from "@features/visits";
import { useKeyHandler } from "@hooks";
import { TimelineContext } from "./TimelineContext";

export const TimelineProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [timelineMode, setTimelineMode] = useState(false);
  const { play } = useAudio();
  const prevTimelineMode = useRef(false);
  const [showVisitedOnly, setShowVisitedOnly] = useState(false);

  // Compute years from trips
  const { trips } = useTrips();
  const years = useMemo(() => getYearsFromTrips(trips), [trips]);
  const [selectedYear, setSelectedYear] = useState(getLatestYear(years));

  // Overlay mode state
  const [overlayMode, setOverlayMode] = useState<OverlayMode>("cumulative");

  // Toggle Timeline mode with "T"
  useKeyHandler(() => setTimelineMode((prev) => !prev), ["t", "T"], true);

  // When timeline mode changes, update showVisitedOnly and play sound
  useEffect(() => {
    setShowVisitedOnly(timelineMode);
    if (timelineMode && !prevTimelineMode.current) {
      play("swoosh");
    }
    else play("woosh");
    prevTimelineMode.current = timelineMode;
  }, [timelineMode, play]);

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
