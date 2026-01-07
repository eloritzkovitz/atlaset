import { DEFAULT_MAP_SETTINGS } from "@constants";
import { useMarkers } from "@contexts/MarkersContext";
import { getGeoCoordsFromMouseEvent } from "../utils/projection";
import { useMapView } from "@contexts/MapViewContext";

/**
 * Handles map events to get geographic coordinates from mouse events.
 * @returns A function that processes mouse events on the map SVG element.
 */
export function useMapEventHandler() {
  const { projection, zoom, center, setSelectedCoords, dimensions } =
    useMapView();
  const { isAddingMarker, handleMapClickForMarker } = useMarkers();

  return (event: React.MouseEvent<SVGSVGElement>) => {
    const coords = getGeoCoordsFromMouseEvent(
      event,
      projection || DEFAULT_MAP_SETTINGS.projection,
      dimensions.width,
      dimensions.height,
      DEFAULT_MAP_SETTINGS.scaleDivisor,
      zoom,
      center
    );
    if (coords) {
      setSelectedCoords(coords);
      if (isAddingMarker && handleMapClickForMarker && event.type === "click") {
        handleMapClickForMarker(coords);
      }
    }
  };
}
