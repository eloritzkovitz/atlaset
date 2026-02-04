import { useMemo } from "react";
import { FaEye, FaMapPin, FaTimeline, FaShareNodes } from "react-icons/fa6";
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
  isEmbed?: boolean;
}

export function MapUiContainer({
  layers,
  isAddingMarker,
  isEmbed,
}: MapUiContainerProps) {
  const { isReadonly, isEdit, zoom, setZoom, center, selectedCoords } =
    useMapView();
  const { timelineMode, layerMode } = useTimeline();
  const { showLegend, closeLegend, uiVisible } = useUI();
  const legendItems: LegendItem[] = useMapLegendItems(
    layers,
    timelineMode,
    layerMode,
  );

  // UI hint for adding marker
  const addMarkerHint = useMemo(
    () =>
      isAddingMarker && !isEmbed
        ? {
            message: <>Click on the map to place a marker.</>,
            icon: <FaMapPin className="text-lg" />,
          }
        : null,
    [isAddingMarker, isEmbed],
  );

  // UI hint for timeline mode
  const timelineHint = useMemo(
    () =>
      timelineMode && uiVisible && !isEmbed
        ? {
            message: <>Timeline mode enabled. Press T to toggle off.</>,
            icon: <FaTimeline className="text-lg" />,
          }
        : null,
    [timelineMode, uiVisible, isEmbed],
  );

  // UI hint for shared/saved maps
  const sharedMapInfo = useSharedMapInfo() || {};
  const mapName = sharedMapInfo.mapName;
  const sharer = sharedMapInfo.sharer;
  const sharedHint = useMemo(() => {
    if ((!isReadonly && !isEdit) || isEmbed) return null;
    const displayMapName = mapName ? mapName : "a shared map";
    const displaySharer = sharer ? sharer : "an anonymous user";
    const msg = (
      <>
        Viewing <b>{displayMapName}</b>
        {isReadonly && !isEdit && (
          <span>
            by <b>{displaySharer}</b>.
          </span>
        )}
        {isEdit ? <>in Edit Mode.</> : <>Editing is disabled.</>}
      </>
    );
    return {
      message: msg,
      icon: isEdit ? (
        <FaEye className="text-lg" />
      ) : (
        <FaShareNodes className="text-lg" />
      ),
    };
  }, [isReadonly, isEdit, isEmbed, mapName, sharer]);

  useUiHint(addMarkerHint, 0, { key: "add-marker", dismissable: false });
  useUiHint(timelineHint, 0, { key: "timeline", dismissable: true });
  useUiHint(sharedHint, 0, { key: "shared-map", dismissable: true });

  // Don't render UI if not visible
  if (!uiVisible) return null;

  return (
    <>
      {/* Map UI components */}
      {timelineMode && !isEmbed && !isEdit && (
        <>
          <TimelineBar />
          <TimelineNavigator />
        </>
      )}
      <MapToolbar zoom={zoom} setZoom={setZoom} isEmbed={isEmbed} />
      {!isEmbed && (
        <>
          <MapFooter zoom={zoom} coords={selectedCoords} latitude={center[1]} />
          <MapLegendModal
            open={showLegend}
            onClose={closeLegend}
            items={legendItems}
          />
        </>
      )}
    </>
  );
}
