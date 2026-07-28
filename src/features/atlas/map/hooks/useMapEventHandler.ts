import { useMarkers } from "@features/atlas/markers";
import { useSavedMaps } from "@features/atlas/savedMaps";
import { useMapSettings } from "@features/atlas/settings";
import { DEFAULT_MAP_SETTINGS } from "@features/settings";
import { useMapView } from "../context/MapViewContext";
import { getGeoCoordsFromMouseEvent } from "../utils/projection";

/**
 * Handles map events to get geographic coordinates from mouse events.
 * @returns A function that processes mouse events on the map SVG element.
 */
export function useMapEventHandler() {
  const { projection } = useMapSettings();
  const { zoom, center, setSelectedCoords, dimensions, isEdit } = useMapView();
  const markerContext = useMarkers();
  const savedMapsContext = useSavedMaps();

  const activeMarkerManager = isEdit ? savedMapsContext : markerContext;
  const { isAddingMarker, handleMapClickForMarker } = activeMarkerManager;

  return (event: React.MouseEvent<SVGSVGElement>) => {
    const coords = getGeoCoordsFromMouseEvent(
      event,
      projection || DEFAULT_MAP_SETTINGS.projection,
      dimensions.width,
      dimensions.height,
      DEFAULT_MAP_SETTINGS.scaleDivisor,
      zoom,
      center,
    );
    if (coords) {
      setSelectedCoords(coords);
      if (isAddingMarker && handleMapClickForMarker && event.type === "click") {
        handleMapClickForMarker(coords);
      }
    }
  };
}
