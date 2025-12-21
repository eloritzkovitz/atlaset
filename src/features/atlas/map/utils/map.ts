/**
 * Map utility functions using D3.js for projections and geographical calculations.
 */

import * as d3geo from "d3-geo";
import type { GeoProjection } from "d3-geo";
import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from "geojson";

/**
 * Normalizes GeoJSON feature properties to ensure they are always defined.
 * @param geoData - The GeoJSON FeatureCollection to normalize.
 * @returns The normalized GeoJSON FeatureCollection.
 */
export function normalizeGeoDataProperties(
  geoData: FeatureCollection<Geometry, GeoJsonProperties> | null
): FeatureCollection<Geometry, { [key: string]: unknown }> | null {
  if (!geoData || !Array.isArray(geoData.features)) return null;
  return {
    ...geoData,
    features: geoData.features.map((feature) => ({
      ...feature,
      properties: feature.properties ?? {},
    })),
  };
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
/**
 * Returns a D3 projection instance based on type and map dimensions.
 */
export function getProjection(
  projectionType: string,
  width: number,
  height: number,
  scaleDivisor: number,
  zoom: number = 1,
  center: [number, number] = [0, 0],
  geoFns: {
    geoNaturalEarth1?: typeof d3geo.geoNaturalEarth1;
    geoEquirectangular?: typeof d3geo.geoEquirectangular;
    geoMercator?: typeof d3geo.geoMercator;
  } = {}
): GeoProjection {
  const {
    geoNaturalEarth1 = d3geo.geoNaturalEarth1,
    geoEquirectangular = d3geo.geoEquirectangular,
    geoMercator = d3geo.geoMercator,
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
  center: [number, number],
  getProjectionFn: typeof getProjection = getProjection
): [number, number] | null {
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
    center
  );
  return proj?.invert?.([x, y]) ?? null;
}

/**
 * Gets the centroid of a GeoJSON feature.
 * @param feature - The GeoJSON feature.
 * @returns = The [longitude, latitude] coordinates of the centroid.
 */
export function getFeatureCentroid(
  feature: Feature<Geometry, { [key: string]: unknown }>,
  geoCentroidFn: typeof d3geo.geoCentroid = d3geo.geoCentroid
) {
  return geoCentroidFn(feature);
}

/** Get the center coordinates and appropriate zoom level for a given country ISO code.
 * @param geoData - The GeoJSON data containing country geometries.
 * @param isoCode - The ISO code of the country to center on.
 * @returns An object with center coordinates and zoom level, or null if not found.
 */
export function getCountryCenterAndZoom(
  geoData: FeatureCollection<Geometry, { [key: string]: unknown }>,
  isoCode: string,
  geoCentroidFn: typeof d3geo.geoCentroid = d3geo.geoCentroid,
  geoBoundsFn: typeof d3geo.geoBounds = d3geo.geoBounds
) {
  const country = geoData.features.find(
    (feature) =>
      feature.properties["ISO3166-1-Alpha-2"] === isoCode ||
      feature.properties["ISO3166-1-Alpha-3"] === isoCode
  );
  if (!country) return null;

  const centroid = geoCentroidFn(country);
  const bounds = geoBoundsFn(country);
  const [[minLng, minLat], [maxLng, maxLat]] = bounds;
  const latDiff = Math.abs(maxLat - minLat);
  const lngDiff = Math.abs(maxLng - minLng);
  const maxDiff = Math.max(latDiff, lngDiff);

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
  barPx: number = 100
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
