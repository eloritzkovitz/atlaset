import type { GeoProjection } from "d3-geo";
import { Geography } from "./Geography";
import type { GeoData, GeographyFeature } from "../types";
import { getCountryCenterAndZoom } from "../utils/projection";

interface SmallCountryOverlayProps {
  geo: GeographyFeature;
  isoCode: string;
  geography: GeoData;
  projection: GeoProjection;
  circleRadius: number;
  style: React.CSSProperties;
  sharedProps: Record<string, unknown>;
}

/** Represents a circle overlay for small countries on the map. */
export function SmallCountryOverlay({
  geo,
  isoCode,
  geography,
  projection,
  circleRadius,
  style,
  sharedProps,
}: SmallCountryOverlayProps) {
  const centerInfo = getCountryCenterAndZoom(geography, isoCode);
  if (!centerInfo || !projection) return null;

  const [cx, cy] = projection(centerInfo.center) || [0, 0];
  const r = circleRadius;

  const circlePathString = `M ${cx} ${cy} m -${r}, 0 a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 -${r * 2},0`;

  const circleFeature: GeographyFeature = {
    ...geo,
    rsmKey: `${geo.rsmKey}-overlay-circle`,
    svgPath: circlePathString,
  };

  return (
    <Geography
      key={circleFeature.rsmKey}
      geography={circleFeature}
      style={{
        default: style,
        hover: style,
        pressed: style,
      }}
      {...sharedProps}
    />
  );
}
