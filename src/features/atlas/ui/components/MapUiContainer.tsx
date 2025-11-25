import { FaClockRotateLeft, FaMapPin } from "react-icons/fa6";
import { useUI } from "@contexts/UIContext";
import { useUiHint } from "@hooks/useUiHint";
import type { OverlayMode } from "@types";
import { MapCoordinatesDisplay } from "../controls/MapCoordinatesDisplay";
import { MapLegendModal } from "../legend/MapLegendModal";
import { useMapLegendItems } from "../legend/useMapLegendItems";
import { MapToolbar } from "../toolbar/MapToolbar";
import { TimelineNavigator } from "../timeline/TimelineNavigator";
import { useMemo } from "react";

interface MapUiContainerProps {
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  selectedCoords: [number, number] | null;
  setTimelineMode: React.Dispatch<React.SetStateAction<boolean>>;
  years: number[];
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  overlays: any[];
  isAddingMarker?: boolean;
  overlayMode: OverlayMode;
  setOverlayMode: React.Dispatch<React.SetStateAction<OverlayMode>>;
}

export function MapUiContainer({
  zoom,
  setZoom,
  selectedCoords,
  setTimelineMode,
  years,
  selectedYear,
  setSelectedYear,
  overlays,
  isAddingMarker,
  overlayMode,
  setOverlayMode,
}: MapUiContainerProps) {
  const { showLegend, toggleLegend, timelineMode, uiVisible } = useUI();
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
            icon: <FaClockRotateLeft className="text-lg" />,
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
      <MapToolbar
        zoom={zoom}
        setZoom={setZoom}
        setTimelineMode={setTimelineMode}
      />
      {selectedCoords && <MapCoordinatesDisplay coords={selectedCoords} />}
      {timelineMode && (
        <TimelineNavigator
          years={years}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          overlayMode={overlayMode}
          setOverlayMode={setOverlayMode}
        />
      )}
      <MapLegendModal
        open={showLegend}
        onClose={toggleLegend}
        items={legendItems}
      />
    </>
  );
}
