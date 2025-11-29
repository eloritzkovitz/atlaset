import { DEFAULT_MAP_SETTINGS } from "@constants";
import { getGeoCoordsFromMouseEvent } from "@features/atlas/map";
import { useMarkers } from "@contexts/MarkersContext";

interface UseMapEventHandlerProps {
  projection: string | null;
  dimensions: { width: number; height: number };
  zoom: number;
  center: [number, number];
  setSelectedCoords: (coords: [number, number]) => void;
}

/**
 * Handles map events to get geographic coordinates from mouse events.
 * @param projection - The map projection type.
 * @param dimensions - The dimensions of the map container.
 * @param zoom - The current zoom level of the map.
 * @param center - The current center coordinates of the map.
 * @param setSelectedCoords - Function to set the selected geographic coordinates.
 * @returns
 */
export function useMapEventHandler({
  projection,
  dimensions,
  zoom,
  center,
  setSelectedCoords,
}: UseMapEventHandlerProps) {
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
      setSelectedCoords([coords[0], coords[1]]);
      if (isAddingMarker && handleMapClickForMarker && event.type === "click") {
        handleMapClickForMarker([coords[0], coords[1]]);
      }
    }
  };
}
