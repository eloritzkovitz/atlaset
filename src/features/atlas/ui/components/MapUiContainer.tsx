import { useMemo } from "react";
import { FaMapPin, FaTimeline, FaShareNodes } from "react-icons/fa6";
import { useMapView } from "@contexts/MapViewContext";
import { useTimeline } from "@contexts/TimelineContext";
import { useUI } from "@contexts/UIContext";
import { useSharedMapInfo } from "@features/atlas/export";
import type { Layer } from "@features/atlas/layers";
import { TimelineBar, TimelineNavigator } from "@features/atlas/timeline";
import { useUiHint } from "@hooks";
import { MapToolbar } from "./controls/MapToolbar";
import { MapFooter } from "./footer/MapFooter";
import { MapLegendModal } from "./legend/MapLegendModal";
import { useMapLegendItems } from "../hooks/useMapLegendItems";
import type { LegendItem } from "../types";

interface MapUiContainerProps {
  layers: Layer[];
  isAddingMarker?: boolean;
}

export function MapUiContainer({
  layers,
  isAddingMarker,
}: MapUiContainerProps) {
  const { isReadonly, zoom, setZoom, center, selectedCoords } = useMapView();
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

  // UI hint for shared/readonly map, with map name and sharer if available
  const sharedMapInfo = useSharedMapInfo() || {};
  const mapName = sharedMapInfo.mapName;
  const sharer = sharedMapInfo.sharer;
  const sharedHint = useMemo(() => {
    if (!isReadonly) return null;
    let msg = (
      <>
        Viewing a <b>shared map</b>. Editing is disabled.
      </>
    );
    if (mapName || sharer) {
      msg = (
        <>
          Viewing <b>{mapName || "a shared map"}</b>
          {sharer ? (
            <span>
              {" "}
              by <b>{sharer}</b>.
            </span>
          ) : (
            "."
          )}
          Editing is disabled.
        </>
      );
    }
    return {
      message: msg,
      icon: <FaShareNodes className="text-lg" />,
    };
  }, [isReadonly, mapName, sharer]);

  useUiHint(addMarkerHint, 0, { key: "add-marker", dismissable: false });
  useUiHint(timelineHint, 0, { key: "timeline", dismissable: true });
  useUiHint(sharedHint, 0, { key: "shared-map", dismissable: true });

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
        isReadonly={isReadonly}
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
