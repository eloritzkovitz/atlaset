import { useMemo } from "react";
import { FaMapPin, FaTimeline } from "react-icons/fa6";
import { useTimeline } from "@contexts/TimelineContext";
import { useUI } from "@contexts/UIContext";
import type { Overlay } from "@features/atlas/overlays";
import { TimelineBar, TimelineNavigator } from "@features/atlas/timeline";
import { useUiHint } from "@hooks/useUiHint";
import { MapFooter } from "./controls/MapFooter";
import { MapLegendModal } from "./legend/MapLegendModal";
import { MapToolbar } from "./toolbar/MapToolbar";
import { useMapLegendItems } from "../hooks/useMapLegendItems";
import type { LegendItem } from "../types";

interface MapUiContainerProps {
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  center: [number, number];
  selectedCoords: [number, number] | null;
  overlays: Overlay[];
  isAddingMarker?: boolean;
}

export function MapUiContainer({
  zoom,
  setZoom,
  center,
  selectedCoords,
  overlays,
  isAddingMarker,
}: MapUiContainerProps) {
  const { timelineMode, setTimelineMode, overlayMode } = useTimeline();
  const { showLegend, closeLegend, uiVisible } = useUI();  
  const legendItems: LegendItem[] = useMapLegendItems(
    overlays,
    timelineMode,
    overlayMode
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
