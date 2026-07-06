import React, { useEffect, useMemo, useState, useRef } from "react";
import { useAudio } from "@contexts/AudioContext";
import { useTrips } from "@contexts/TripsContext";
import { getLatestYear, getYearsFromTrips } from "@features/visits";
import { useKeyHandler } from "@hooks";
import { isAuthenticated } from "@utils/firebase";
import { useMapView } from "./MapViewContext";
import { TimelineContext } from "./TimelineContext";

export const TimelineProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { mapMode, setColorMode } = useMapView();
  const [timelineMode, setTimelineMode] = useState(false);
  const prevTimelineMode = useRef(false);
  const [showVisitedOnly, setShowVisitedOnly] = useState(false);
  const { play } = useAudio();

  // Compute years from trips
  const { trips } = useTrips();
  const years = useMemo(() => getYearsFromTrips(trips), [trips]);
  const [selectedYear, setSelectedYear] = useState(getLatestYear(years));

  // Only allow timeline mode if authenticated and not readonly/edit
  const handleSetTimelineMode = (v: boolean | ((prev: boolean) => boolean)) => {
    const next = typeof v === "function" ? v(timelineMode) : v;
    if (next) {
      if (!isAuthenticated() || mapMode === "edit" || mapMode === "readonly") {
        return;
      }
      setTimelineMode(true);
      setColorMode("cumulative");
    } else {
      setTimelineMode(false);
      setColorMode("standard");
    }
  };

  // Toggle Timeline mode with "T"
  useKeyHandler(
    () => {
      handleSetTimelineMode((prev) => !prev);
      setTimeout(() => {
        try {
          window.dispatchEvent(new Event("pointerdown", { bubbles: true }));
        } catch {
          void 0;
        }
      }, 0);
    },
    ["t", "T"],
    true,
  );

  // When timeline mode changes, update showVisitedOnly and play sound
  useEffect(() => {
    setShowVisitedOnly(timelineMode);
    if (!timelineMode && prevTimelineMode.current) {
      play("woosh");
    } else if (timelineMode && !prevTimelineMode.current) {
      play("swoosh");
    }
    prevTimelineMode.current = timelineMode;
  }, [timelineMode, play]);

  return (
    <TimelineContext.Provider
      value={{
        timelineMode,
        setTimelineMode: handleSetTimelineMode,
        showVisitedOnly,
        setShowVisitedOnly,
        years,
        selectedYear,
        setSelectedYear,
      }}
    >
      {children}
    </TimelineContext.Provider>
  );
};
