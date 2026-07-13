/**
 * Utility functions for handling geographical data in GeoJSON and TopoJSON formats.
 */

import { feature, mesh } from "topojson-client";
import type { Feature, Geometry } from "geojson";
import type {
  GeographyFeature,
  Topology,
  GeoJsonProperties,
  GeoJsonFeature,
} from "../types";

/**
 * Extracts GeoJSON features from various geography data formats (GeoJSON or TopoJSON).
 * @param geographies - The geography data which can be GeoJSON FeatureCollection, Feature, or TopoJSON.
 * @param parseGeographies - Optional function to parse and transform the features.
 * @returns An array of GeoJSON features.
 */
export function getFeatures(
  geographies:
    | GeoJsonFeature
    | { type: string; features?: GeoJsonFeature[] }
    | unknown,
  parseGeographies?: (features: GeoJsonFeature[]) => GeoJsonFeature[],
): GeoJsonFeature[] {
  const isTopojson = (geographies as { type?: string }).type === "Topology";
  if (!isTopojson) {
    const maybe = geographies as
      | {
          type?: string;
          features?: GeoJsonFeature[];
        }
      | GeoJsonFeature[];

    if (
      maybe &&
      (maybe as { type?: string }).type === "FeatureCollection" &&
      Array.isArray((maybe as { features?: GeoJsonFeature[] }).features)
    ) {
      const feats = (maybe as { features: GeoJsonFeature[] }).features;
      return parseGeographies ? parseGeographies(feats) : feats;
    }

    if ((maybe as { type?: string }).type === "Feature") {
      const feats = [geographies as GeoJsonFeature];
      return parseGeographies ? parseGeographies(feats) : feats;
    }
    const arr = geographies as GeoJsonFeature[];
    return parseGeographies ? parseGeographies(arr) : arr;
  }
  const topo = geographies as Topology;
  const objectKey = Object.keys(topo.objects)[0];
  const fc = feature(
    topo as unknown as Parameters<typeof feature>[0],
    topo.objects[objectKey] as unknown as Parameters<typeof feature>[1],
  ) as {
    type: string;
    features?: Feature<Geometry, GeoJsonProperties>[];
  };
  const feats =
    fc && fc.type === "FeatureCollection" && Array.isArray(fc.features)
      ? (fc.features as GeoJsonFeature[])
      : [];
  return parseGeographies ? parseGeographies(feats) : feats;
}

/**
 * Converts a GeoJSON geometry to a GeoJSON feature.
 * @param geometry - The GeoJSON geometry.
 * @returns The GeoJSON feature or undefined if geometry is undefined.
 */
function geometryToFeature(
  geometry: Geometry | undefined,
): GeoJsonFeature | undefined {
  return geometry ? { type: "Feature", geometry, properties: {} } : undefined;
}

/**
 * Extracts mesh features (outline and borders) from TopoJSON data.
 * @param geographies - The TopoJSON data.
 * @returns An object containing outline and borders GeoJSON features, or null if not TopoJSON.
 */
export function getMesh(
  geographies:
    | GeoJsonFeature
    | { type: string; features?: GeoJsonFeature[] }
    | unknown,
): {
  outline?: GeoJsonFeature;
  borders?: GeoJsonFeature;
} | null {
  const isTopojson = (geographies as { type?: string }).type === "Topology";
  if (!isTopojson) return null;
  const topo = geographies as Topology;
  const objectKey = Object.keys(topo.objects)[0];
  const outlineGeometry = mesh(
    topo as unknown as Parameters<typeof mesh>[0],
    topo.objects[objectKey] as unknown as Parameters<typeof mesh>[1],
    (a: unknown, b: unknown) => a === b,
  );
  const bordersGeometry = mesh(
    topo as unknown as Parameters<typeof mesh>[0],
    topo.objects[objectKey] as unknown as Parameters<typeof mesh>[1],
    (a: unknown, b: unknown) => a !== b,
  );
  const outline = geometryToFeature(outlineGeometry);
  const borders = geometryToFeature(bordersGeometry);

  return { outline, borders };
}

/**
 * Prepares mesh features (outline and borders) by adding SVG path data and unique keys.
 * @param outline - Outline GeoJSON feature.
 * @param borders - Borders GeoJSON feature.
 * @param path - Function to generate SVG path from a GeoJSON feature.
 * @returns Object containing prepared outline and borders GeographyFeatures.
 */
export function prepareMesh(
  outline: GeographyFeature | undefined,
  borders: GeographyFeature | undefined,
  path: (object: GeoJsonFeature) => string | null,
): { outline?: GeographyFeature; borders?: GeographyFeature } {
  return outline && borders
    ? {
        outline: {
          ...outline,
          rsmKey: "outline",
          svgPath: path(outline) ?? "",
        },
        borders: {
          ...borders,
          rsmKey: "borders",
          svgPath: path(borders) ?? "",
        },
      }
    : {};
}

/**
 * Prepares geographical features by adding SVG path data and unique keys.
 * @param geographies - Array of GeoJSON features.
 * @param path - Function to generate SVG path from a GeoJSON feature.
 * @returns - Array of GeographyFeature with svgPath and rsmKey properties.
 */
export function prepareFeatures(
  geographies: GeoJsonFeature[],
  path: (object: GeoJsonFeature) => string | null,
): GeographyFeature[] {
  return geographies.map((d, i) => ({
    ...d,
    rsmKey: `geo-${i}`,
    svgPath: path(d) ?? "",
  }));
}

/**
 * Creates an SVG path string for a connector with specified offsets and curvature.
 * @param dx - Horizontal offset.
 * @param dy - Vertical offset.
 * @param curve - Curvature of the connector. Can be a single number or a tuple [curveX, curveY].
 * @returns SVG path string for the connector.
 */
export function createConnectorPath(
  dx = 30,
  dy = 30,
  curve: number | [number, number] = 0.5,
): string {
  const curvature = Array.isArray(curve) ? curve : [curve, curve];
  const curveX = (dx / 2) * curvature[0];
  const curveY = (dy / 2) * curvature[1];
  return `M${0},${0} Q${-dx / 2 - curveX},${-dy / 2 + curveY} ${-dx},${-dy}`;
}
