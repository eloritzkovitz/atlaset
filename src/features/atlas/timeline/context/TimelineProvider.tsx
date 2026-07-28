import React, { useEffect, useMemo, useState, useRef } from "react";
import { useAudio } from "@contexts/AudioContext";
import { useTrips } from "@contexts/TripsContext";
import { useMapView } from "@features/atlas/map/context/MapViewContext";
import { getLatestYear, getYearsFromTrips } from "@features/visits";
import { isAuthenticated } from "@lib/firebase";
import { TimelineContext } from "./TimelineContext";

export const TimelineProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { play } = useAudio();
  const { mapMode, setColorMode } = useMapView();

  const [timelineMode, setTimelineMode] = useState(false);
  const prevTimelineMode = useRef(false);

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

  // When timeline mode changes, play a sound effect
  useEffect(() => {
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
        years,
        selectedYear,
        setSelectedYear,
      }}
    >
      {children}
    </TimelineContext.Provider>
  );
};
