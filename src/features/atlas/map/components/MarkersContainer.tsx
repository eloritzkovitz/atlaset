import type { GeoProjection } from "d3-geo";
import {
  MarkerPin,
  useEffectiveMarkers,
  useMarkers,
} from "@features/atlas/markers";
import type { Point } from "@types";
import { useMapView } from "../context/MapViewContext";
import { useMapContext } from "../providers/MapContext";
import { getCountryCenterAndZoom } from "../utils/projection";

interface MarkersContainerProps {
  zoom?: number;
  projection?: GeoProjection;
}

export function MarkersContainer({
  zoom = 1,
  projection: propsProjection,
}: MarkersContainerProps) {
  const { showMarkerDetails } = useMarkers();
  const markers = useEffectiveMarkers();
  const { geoData } = useMapView();

  // Retrieve the actual callable D3 projection function from context
  const mapContext = useMapContext();
  const proj =
    propsProjection || (mapContext?.projection as GeoProjection | undefined);

  return (
    <>
      {markers
        .filter((marker) => marker.visible !== false)
        .map((marker) => {
          if (!proj || !geoData || !marker.isoCode) return null;

          // Look up country center coordinates dynamically using ISO code
          const countryData = getCountryCenterAndZoom(geoData, marker.isoCode);
          if (!countryData?.center) return null;

          // Project geographic [lng, lat] to SVG canvas [x, y]
          const point = proj(countryData.center);

          // Validate the projected point
          if (!point || isNaN(point[0]) || isNaN(point[1])) return null;

          const pixelPos: Point = { x: point[0], y: point[1] };

          return (
            <MarkerPin
              key={marker.id}
              position={pixelPos}
              color={marker.color}
              name={marker.name}
              zoom={zoom}
              onClick={(event, pos) => {
                const svg = event.currentTarget.ownerSVGElement;
                if (!svg) return;

                const pt = svg.createSVGPoint();
                pt.x = pos.x;
                pt.y = pos.y;

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
