import { useMemo } from "react";
import { FaMapPin, FaTimeline } from "react-icons/fa6";
import { useTimeline } from "@contexts/TimelineContext";
import { useUI } from "@contexts/UIContext";
import { useUiHint } from "@hooks/useUiHint";
import { TimelineBar, TimelineNavigator } from "@features/atlas/timeline";
import { MapCoordinatesDisplay } from "../controls/MapCoordinatesDisplay";
import { MapLegendModal } from "../legend/MapLegendModal";
import { useMapLegendItems } from "../legend/useMapLegendItems";
import { MapToolbar } from "../toolbar/MapToolbar";

interface MapUiContainerProps {
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  selectedCoords: [number, number] | null;
  overlays: any[];
  isAddingMarker?: boolean;
}

export function MapUiContainer({
  zoom,
  setZoom,
  selectedCoords,
  overlays,
  isAddingMarker,
}: MapUiContainerProps) {
  const { showLegend, closeLegend, uiVisible } = useUI();
  const { timelineMode, setTimelineMode, overlayMode } = useTimeline();
  const legendItems = useMapLegendItems(overlays, timelineMode, overlayMode);

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
      {selectedCoords && <MapCoordinatesDisplay coords={selectedCoords} />}
      <MapLegendModal
        open={showLegend}
        onClose={closeLegend}
        items={legendItems}
      />
    </>
  );
}
