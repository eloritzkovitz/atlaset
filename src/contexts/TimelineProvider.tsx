import React, { useEffect, useMemo, useState, useRef } from "react";
import { useAudio } from "@contexts/AudioContext";
import { useTrips } from "@contexts/TripsContext";
import { isAuthenticated } from "@utils/firebase";
import { useMapView } from "@contexts/MapViewContext";
import type { LayerMode } from "@features/atlas/layers";
import { getLatestYear, getYearsFromTrips } from "@features/visits";
import { useKeyHandler } from "@hooks";
import { TimelineContext } from "./TimelineContext";

export const TimelineProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [timelineMode, _setTimelineMode] = useState(false);
  const prevTimelineMode = useRef(false);
  const [showVisitedOnly, setShowVisitedOnly] = useState(false);
  const { isReadonly } = useMapView();
  const { play } = useAudio();

  // Compute years from trips
  const { trips } = useTrips();
  const years = useMemo(() => getYearsFromTrips(trips), [trips]);
  const [selectedYear, setSelectedYear] = useState(getLatestYear(years));

  // Layer mode state
  const [layerMode, setLayerMode] = useState<LayerMode>("cumulative");

  // Only allow timeline mode if authenticated and not readonly
  const setTimelineMode = (
    fnOrValue: boolean | ((prev: boolean) => boolean)
  ) => {
    const next =
      typeof fnOrValue === "function" ? fnOrValue(timelineMode) : fnOrValue;
    if (next && (!isAuthenticated() || isReadonly)) {
      // Block enabling timeline mode if not allowed
      return;
    }
    _setTimelineMode(next);
  };

  // Toggle Timeline mode with "T"
  useKeyHandler(() => setTimelineMode((prev) => !prev), ["t", "T"], true);

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
        setTimelineMode,
        showVisitedOnly,
        setShowVisitedOnly,
        years,
        selectedYear,
        setSelectedYear,
        layerMode,
        setLayerMode,
      }}
    >
      {children}
    </TimelineContext.Provider>
  );
};
