import { useMemo } from "react";
import { FaMapPin, FaTimeline } from "react-icons/fa6";
import { useTimeline } from "@contexts/TimelineContext";
import { useUI } from "@contexts/UIContext";
import type { Layer } from "@features/atlas/layers";
import { TimelineBar, TimelineNavigator } from "@features/atlas/timeline";
import { useUiHint } from "@hooks";
import { MapToolbar } from "./controls/MapToolbar";
import { MapFooter } from "./footer/MapFooter";
import { MapLegendModal } from "./legend/MapLegendModal";
import { useMapLegendItems } from "../hooks/useMapLegendItems";
import type { Coordinates } from "@features/atlas/map";
import type { LegendItem } from "../types";

interface MapUiContainerProps {
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  center: [number, number];
  selectedCoords: Coordinates | null;
  layers: Layer[];
  isAddingMarker?: boolean;
}

export function MapUiContainer({
  zoom,
  setZoom,
  center,
  selectedCoords,
  layers,
  isAddingMarker,
}: MapUiContainerProps) {
  const { timelineMode, setTimelineMode, layerMode } = useTimeline();
  const { showLegend, closeLegend, uiVisible } = useUI();  
  const legendItems: LegendItem[] = useMapLegendItems(
    layers,
    timelineMode,
    layerMode
  );

  // UI hint for adding marker
  const addMarkerHint = useMemo(
    () =>
      isAddingMarker
        ? {
            message: <>Click on the map to place a marker.</>,
            icon: <FaMapPin className="text-lg" />,
          }
        : null,
    [isAddingMarker]
  );

  // UI hint for timeline mode
  const timelineHint = useMemo(
    () =>
      timelineMode && uiVisible
        ? {
            message: <>Timeline mode enabled. Press T to toggle off.</>,
            icon: <FaTimeline className="text-lg" />,
          }
        : null,
    [timelineMode, uiVisible]
  );

  useUiHint(addMarkerHint, 0, { key: "add-marker", dismissable: false });
  useUiHint(timelineHint, 0, { key: "timeline", dismissable: true });

  // Don't render UI if not visible
  if (!uiVisible) return null;

  return (
    <>
      {/* Map UI components */}
      {timelineMode && (
        <>
          <TimelineBar />
          <TimelineNavigator />
        </>
      )}
      <MapToolbar
        zoom={zoom}
        setZoom={setZoom}
        setTimelineMode={setTimelineMode}
      />
      <MapFooter zoom={zoom} coords={selectedCoords} latitude={center[1]} />
      <MapLegendModal
        open={showLegend}
        onClose={closeLegend}
        items={legendItems}
      />
    </>
  );
}
