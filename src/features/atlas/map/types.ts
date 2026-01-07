import type { ZoomTransform } from "d3-zoom";
import type { Feature, FeatureCollection, Geometry } from "geojson";

export interface ProjectionConfig {
  center?: [number, number];
  rotate?: [number, number, number];
  parallels?: [number, number];
  scale?: number;
}

export interface GeographyFeature
  extends Feature<Geometry, Record<string, unknown>> {
  svgPath: string;
  rsmKey: string;
}

export type GeoData = FeatureCollection<
  Geometry,
  { [key: string]: unknown } | null
> | null;

// TopoJSON/GeoJSON compatibility types
export type GeoJsonProperties = Record<string, unknown>;

export interface GeometryObject {
  type: string;
  properties?: GeoJsonProperties;
  geometry?: Geometry;
  geometries?: GeometryObject[]; // for GeometryCollection
}

export interface Topology {
  type: "Topology";
  objects: { [key: string]: GeometryObject };
  arcs?: unknown;
  transform?: unknown;
}

// Custom type for d3-zoom event
export type ZoomEvent = {
  transform: ZoomTransform;
  sourceEvent?: Event;
};

export type Coordinates = [number, number];
