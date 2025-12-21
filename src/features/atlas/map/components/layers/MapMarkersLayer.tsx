import { useMarkers } from "@contexts/MarkersContext";
import { Marker } from "@features/atlas/markers";
import { getProjection } from "../../utils/map";

interface MapMarkersLayerProps {
  projectionType: string;
  width: number;
  height: number;
  scaleDivisor: number;
  zoom?: number;
}

export function MapMarkersLayer({
  projectionType,
  width,
  height,
  scaleDivisor,
  zoom = 1,
}: MapMarkersLayerProps & { zoom?: number }) {
  const { markers, showMarkerDetails } = useMarkers();
  const proj = getProjection(projectionType, width, height, scaleDivisor);

  return (
    <>
      {markers
        .filter((marker) => marker.visible !== false)
        .map((marker) => {
          const point = proj ? proj([marker.longitude, marker.latitude]) : null;
          if (!point) return null;
          const [x, y] = point;
          return (
            <Marker
              key={marker.id}
              x={x}
              y={y}
              color={marker.color}
              name={marker.name}
              zoom={zoom}
              onClick={(event, markerX, markerY) => {
                const svg = event.currentTarget.ownerSVGElement;
                if (!svg) return;
                const pt = svg.createSVGPoint();
                pt.x = markerX;
                pt.y = markerY;
                const ctm = svg.getScreenCTM();
                if (!ctm) return;
                const screenCoords = pt.matrixTransform(ctm);
                showMarkerDetails(marker, {
                  top: screenCoords.y,
                  left: screenCoords.x,
                });
              }}
            />
          );
        })}
    </>
  );
}
