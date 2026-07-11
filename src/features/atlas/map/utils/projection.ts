/**
 * Utility functions using D3.js for projections and geographical calculations.
 */

import * as d3Geo from "d3-geo";
import type { GeoProjection } from "d3-geo";
import type { Feature, Geometry } from "geojson";
import type { TransformState } from "@types";
import type { Coordinates, GeoData, ProjectionConfig } from "../types";

interface ProjectionConfigurable {
  center?: (center?: Coordinates) => d3Geo.GeoProjection;
  rotate?: (rotate?: [number, number, number]) => d3Geo.GeoProjection;
  scale?: ((scale: number) => d3Geo.GeoProjection) | (() => number);
  parallels?: (parallels?: Coordinates) => d3Geo.GeoProjection;
}

export const projectionMap: Record<string, () => d3Geo.GeoProjection> = {
  geoAzimuthalEqualArea: d3Geo.geoAzimuthalEqualArea,
  geoAzimuthalEquidistant: d3Geo.geoAzimuthalEquidistant,
  geoConicConformal: d3Geo.geoConicConformal,
  geoConicEqualArea: d3Geo.geoConicEqualArea,
  geoConicEquidistant: d3Geo.geoConicEquidistant,
  geoEquirectangular: d3Geo.geoEquirectangular,
  geoGnomonic: d3Geo.geoGnomonic,
  geoMercator: d3Geo.geoMercator,
  geoOrthographic: d3Geo.geoOrthographic,
  geoStereographic: d3Geo.geoStereographic,
  geoTransverseMercator: d3Geo.geoTransverseMercator,
  geoEqualEarth: d3Geo.geoEqualEarth,
  geoNaturalEarth1: d3Geo.geoNaturalEarth1,
};

/**
 * Creates a D3 GeoProjection based on the provided configuration.
 * @param projectionConfig - Configuration options for the projection.
 * @param projection - The projection type as a string or a custom projection function.
 * @param width - Width of the map for centering the projection.
 * @param height - Height of the map for centering the projection.
 * @returns A configured D3 GeoProjection.
 */
export function makeProjection({
  projectionConfig = {},
  projection = "geoEqualEarth",
  width = 800,
  height = 600,
}: {
  projectionConfig?: ProjectionConfig;
  projection?: string | ((...args: unknown[]) => d3Geo.GeoProjection);
  width?: number;
  height?: number;
}): d3Geo.GeoProjection {
  if (typeof projection === "function") {
    return projection();
  }

  // Handle string projection
  const projConstructor = projectionMap[projection as string];
  if (!projConstructor) throw new Error(`Unknown projection: ${projection}`);
  let proj = projConstructor().translate([width / 2, height / 2]);

  // Apply projection configuration
  const projConfig = proj as ProjectionConfigurable;
  const supported: (keyof ProjectionConfigurable)[] = [
    typeof projConfig.center === "function" ? "center" : null,
    typeof projConfig.rotate === "function" ? "rotate" : null,
    typeof projConfig.scale === "function" ? "scale" : null,
    typeof projConfig.parallels === "function" ? "parallels" : null,
  ].filter(Boolean) as (keyof ProjectionConfigurable)[];
  supported.forEach((d) => {
    if (!d) return;
    const value = projectionConfig[d];
    if (
      (d === "center" && Array.isArray(value) && value.length === 2) ||
      (d === "rotate" && Array.isArray(value) && value.length === 3) ||
      (d === "parallels" && Array.isArray(value) && value.length === 2) ||
      (d === "scale" && typeof value === "number")
    ) {
      // @ts-expect-error: dynamic method access
      proj = projConfig[d](value);
    }
  });
  return proj;
}

/**
 * Returns a D3 projection instance based on type and map dimensions.
 * @param projectionType - The projection name (e.g., "mercator", "naturalEarth1", "equirectangular").
 * @param width - SVG/map width.
 * @param height - SVG/map height.
 * @param scaleDivisor - Scale divisor for projection.
 * @param zoom - Zoom level (default is 1).
 * @param center - Center coordinates [longitude, latitude] (default is [0, 0]).
 * @returns A configured D3 GeoProjection instance.
 */
export function getProjection(
  projectionType: string,
  width: number,
  height: number,
  scaleDivisor: number,
  zoom: number = 1,
  center: Coordinates = [0, 0],
  geoFns: {
    geoNaturalEarth1?: typeof d3Geo.geoNaturalEarth1;
    geoEquirectangular?: typeof d3Geo.geoEquirectangular;
    geoMercator?: typeof d3Geo.geoMercator;
  } = {},
): GeoProjection {
  const {
    geoNaturalEarth1 = d3Geo.geoNaturalEarth1,
    geoEquirectangular = d3Geo.geoEquirectangular,
    geoMercator = d3Geo.geoMercator,
  } = geoFns;

  const baseScale = Math.min(width, height) / scaleDivisor;
  const scale = baseScale * zoom;

  let proj;
  switch (projectionType) {
    case "naturalEarth1":
      proj = geoNaturalEarth1();
      break;
    case "equirectangular":
      proj = geoEquirectangular();
      break;
    case "mercator":
    default:
      proj = geoMercator();
      break;
  }
  return proj
    .scale(scale)
    .center(center)
    .translate([width / 2, height / 2]);
}

/**
 * Converts transformed map coordinates to original SVG coordinates.
 * @param w - SVG/map width.
 * @param h - SVG/map height.
 * @param t - The transform object containing x, y, and k (scale).
 * @returns - The [x, y] coordinates in the original SVG space.
 */
export function getSvgCoordsFromTransform(
  w: number,
  h: number,
  t: TransformState,
): Coordinates {
  const xOffset = (w * t.k - w) / 2;
  const yOffset = (h * t.k - h) / 2;
  return [w / 2 - (xOffset + t.x) / t.k, h / 2 - (yOffset + t.y) / t.k];
}

/** Converts mouse event coordinates to geographical coordinates.
 * @param event - The mouse event on the SVG element.
 * @param projectionType - The projection name (e.g., "mercator", "naturalEarth1", "equirectangular").
 * @param width - SVG/map width.
 * @param height - SVG/map height.
 * @param scaleDivisor - Scale divisor for projection.
 * @param zoom - Zoom level.
 * @param center - Center coordinates [longitude, latitude].
 * @param getProjectionFn - Function to get the projection (default is the local getProjection function).
 * @returns The [longitude, latitude] coordinates corresponding to the mouse event, or null if conversion fails.
 */
export function getGeoCoordsFromMouseEvent(
  event: React.MouseEvent<SVGSVGElement>,
  projectionType: string,
  width: number,
  height: number,
  scaleDivisor: number,
  zoom: number,
  center: Coordinates,
  getProjectionFn: typeof getProjection = getProjection,
): Coordinates | null {
  const svg = event.currentTarget;
  const rect = svg.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const proj = getProjectionFn(
    projectionType,
    width,
    height,
    scaleDivisor,
    zoom,
    center,
  );
  const result = proj?.invert?.([x, y]) ?? null;
  return result ? [result[1], result[0]] : null;
}

/**
 * Gets the centroid of a GeoJSON feature.
 * @param feature - The GeoJSON feature.
 * @returns = The [longitude, latitude] coordinates of the centroid.
 */
export function getFeatureCentroid(
  feature: Feature<Geometry, { [key: string]: unknown }>,
  geoCentroidFn: typeof d3Geo.geoCentroid = d3Geo.geoCentroid,
) {
  return geoCentroidFn(feature);
}

/** Get the center coordinates and appropriate zoom level for a given country ISO code.
 * @param geoData - The GeoJSON data containing country geometries.
 * @param isoCode - The ISO code of the country to center on.
 * @returns An object with center coordinates and zoom level, or null if not found.
 */
export function getCountryCenterAndZoom(
  geoData: GeoData,
  isoCode: string,
  geoCentroidFn: typeof d3Geo.geoCentroid = d3Geo.geoCentroid,
  geoBoundsFn: typeof d3Geo.geoBounds = d3Geo.geoBounds,
): { center: Coordinates; zoom: number } | null {
  const country = geoData?.features.find((feature) => {
    const props = feature.properties ?? {};
    return (
      props["ISO3166-1-Alpha-2"] === isoCode ||
      props["ISO3166-1-Alpha-3"] === isoCode
    );
  });

  // Return null if country not found
  if (!country) return null;

  // Calculate centroid and bounds
  const centroid = geoCentroidFn(country);
  const bounds = geoBoundsFn(country);
  const [[minLng, minLat], [maxLng, maxLat]] = bounds;
  const latDiff = Math.abs(maxLat - minLat);
  const lngDiff = Math.abs(maxLng - minLng);
  const maxDiff = Math.max(latDiff, lngDiff);

  // Determine zoom level based on size of the country
  const zoom = Math.max(6, 18 - maxDiff * 40);

  return { center: centroid, zoom };
}

/**
 * Calculates the map scale bar label based on zoom level and latitude.
 * @param zoom - The current zoom level.
 * @param latitude - The latitude for scale calculation.
 * @param barPx - The pixel length of the scale bar (default is 100).
 * @returns A string representing the scale bar label (e.g., "500 m", "2.5 km").
 */
export function getScaleBarLabel(
  zoom: number,
  latitude: number,
  barPx: number = 100,
): string {
  if (
    typeof latitude !== "number" ||
    isNaN(latitude) ||
    Math.abs(latitude) > 90
  )
    return "—";
  const metersPerPixel =
    (156543.03392 * Math.cos((latitude * Math.PI) / 180)) / Math.pow(2, zoom);
  const distance = metersPerPixel * barPx;
  if (!isFinite(distance) || isNaN(distance)) return "—";

  // Round to 1, 2, or 5 × 10^n
  const pow10 = Math.pow(10, Math.floor(Math.log10(distance)));
  let rounded;
  if (distance / pow10 < 2) {
    rounded = pow10;
  } else if (distance / pow10 < 5) {
    rounded = 2 * pow10;
  } else {
    rounded = 5 * pow10;
  }

  // Return in meters or kilometers
  if (rounded >= 1000) {
    return `${(rounded / 1000).toFixed(rounded >= 10000 ? 0 : 1)} km`;
  } else {
    return `${rounded} m`;
  }
}
