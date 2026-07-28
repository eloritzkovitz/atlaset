import {
  Marker,
  useEffectiveMarkers,
  useMarkers,
} from "@features/atlas/markers";
import { getProjection } from "../utils/projection";

interface MarkersContainerProps {
  projectionType: string;
  width: number;
  height: number;
  scaleDivisor: number;
  zoom?: number;
}

export function MarkersContainer({
  projectionType,
  width,
  height,
  scaleDivisor,
  zoom = 1,
}: MarkersContainerProps & { zoom?: number }) {
  const { showMarkerDetails } = useMarkers();
  const markers = useEffectiveMarkers();
  const proj = getProjection(projectionType, width, height, scaleDivisor);

  return (
    <>
      {markers
        .filter((marker) => marker.visible !== false)
        .map((marker) => {
          const point = proj ? proj(marker.coordinates) : null;
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
