/**
 * Utility functions for handling geographical data in GeoJSON and TopoJSON formats.
 */

import { feature, mesh } from "topojson-client";
import type { Feature, Geometry } from "geojson";
import type { GeographyFeature, Topology, GeoJsonProperties } from "../types";

/**
 * Extracts GeoJSON features from various geography data formats (GeoJSON or TopoJSON).
 * @param geographies - The geography data which can be GeoJSON FeatureCollection, Feature, or TopoJSON.
 * @param parseGeographies - Optional function to parse and transform the features.
 * @returns An array of GeoJSON features.
 */
export function getFeatures(
  geographies:
    | Feature<Geometry, Record<string, unknown>>
    | { type: string; features?: Feature<Geometry, Record<string, unknown>>[] }
    | unknown,
  parseGeographies?: (
    features: Feature<Geometry, Record<string, unknown>>[]
  ) => Feature<Geometry, Record<string, unknown>>[]
): Feature<Geometry, Record<string, unknown>>[] {
  const isTopojson = (geographies as { type?: string }).type === "Topology";
  if (!isTopojson) {
    if (
      (geographies as { type?: string }).type === "FeatureCollection" &&
      Array.isArray(
        (
          geographies as {
            features?: Feature<Geometry, Record<string, unknown>>[];
          }
        ).features
      )
    ) {
      return parseGeographies
        ? parseGeographies(
            (
              geographies as {
                features: Feature<Geometry, Record<string, unknown>>[];
              }
            ).features
          )
        : (
            geographies as {
              features: Feature<Geometry, Record<string, unknown>>[];
            }
          ).features;
    }
    if ((geographies as { type?: string }).type === "Feature") {
      return parseGeographies
        ? parseGeographies([
            geographies as Feature<Geometry, Record<string, unknown>>,
          ])
        : [geographies as Feature<Geometry, Record<string, unknown>>];
    }
    return parseGeographies
      ? parseGeographies(
          geographies as Feature<Geometry, Record<string, unknown>>[]
        )
      : (geographies as Feature<Geometry, Record<string, unknown>>[]);
  }
  const topo = geographies as Topology;
  const objectKey = Object.keys(topo.objects)[0];
  // topojson-client expects its own Topology type, so cast as unknown
  const fc = feature(
    topo as unknown as Parameters<typeof feature>[0],
    topo.objects[objectKey] as unknown as Parameters<typeof feature>[1]
  ) as {
    type: string;
    features?: Feature<Geometry, GeoJsonProperties>[];
  };
  const feats =
    fc && fc.type === "FeatureCollection" && Array.isArray(fc.features)
      ? (fc.features as Feature<Geometry, Record<string, unknown>>[])
      : [];
  return parseGeographies ? parseGeographies(feats) : feats;
}

/**
 * Extracts mesh features (outline and borders) from TopoJSON data.
 * @param geographies - The TopoJSON data.
 * @returns An object containing outline and borders GeoJSON features, or null if not TopoJSON.
 */
export function getMesh(
  geographies:
    | Feature<Geometry, Record<string, unknown>>
    | { type: string; features?: Feature<Geometry, Record<string, unknown>>[] }
    | unknown
): {
  outline: Feature<Geometry, Record<string, unknown>>;
  borders: Feature<Geometry, Record<string, unknown>>;
} | null {
  const isTopojson = (geographies as { type?: string }).type === "Topology";
  if (!isTopojson) return null;
  const topo = geographies as Topology;
  const objectKey = Object.keys(topo.objects)[0];
  // topojson-client expects its own Topology/GeometryObject types, so cast as unknown
  const outlineGeometry = mesh(
    topo as unknown as Parameters<typeof mesh>[0],
    topo.objects[objectKey] as unknown as Parameters<typeof mesh>[1],
    (a: unknown, b: unknown) => a === b
  );
  const bordersGeometry = mesh(
    topo as unknown as Parameters<typeof mesh>[0],
    topo.objects[objectKey] as unknown as Parameters<typeof mesh>[1],
    (a: unknown, b: unknown) => a !== b
  );
  // Wrap MultiLineString geometry in a Feature
  const outline: Feature<Geometry, Record<string, unknown>> | undefined =
    outlineGeometry
      ? { type: "Feature", geometry: outlineGeometry, properties: {} }
      : undefined;
  const borders: Feature<Geometry, Record<string, unknown>> | undefined =
    bordersGeometry
      ? { type: "Feature", geometry: bordersGeometry, properties: {} }
      : undefined;
  return { outline: outline!, borders: borders! };
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
  path: (object: Feature<Geometry, Record<string, unknown>>) => string | null
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
  geographies: Feature<Geometry, Record<string, unknown>>[],
  path: (object: Feature<Geometry, Record<string, unknown>>) => string | null
): GeographyFeature[] {
  return geographies
    ? geographies.map((d, i) => ({
        ...d,
        rsmKey: `geo-${i}`,
        svgPath: path(d) ?? "",
      }))
    : [];
}

/**
 * Creates an SVG path string for a connector with specified offsets and curvature.
 * @param dx - Horizontal offset.
 * @param dy - Vertical offset.
 * @param curve - Curvature of the connector. Can be a single number or a tuple [curveX, curveY].
 * @returns SVG path string for the connector.
 */
export function createConnectorPath(dx = 30, dy = 30, curve: number | [number, number] = 0.5): string {
  const curvature = Array.isArray(curve) ? curve : [curve, curve];
  const curveX = (dx / 2) * curvature[0];
  const curveY = (dy / 2) * curvature[1];
  return `M${0},${0} Q${-dx / 2 - curveX},${-dy / 2 + curveY} ${-dx},${-dy}`;
}

/**
 * Checks if the provided geo parameter is a string.
 * @param geo - The geography parameter to check.
 * @returns True if geo is a string, false otherwise.
 */
export function isString(geo: unknown): geo is string {
  return typeof geo === "string";
}
