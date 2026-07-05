import type { ZoomTransform } from "d3-zoom";
import type { Feature, FeatureCollection, Geometry } from "geojson";

/** Represents a pair of longitude and latitude coordinates. */
export type Coordinates = [number, number];

/** Represents a bounding box defined by minimum and maximum longitude and latitude values. */
export type BoundingBox = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

/** Properties associated with GeoJSON features. */
export type GeoJsonProperties = Record<string, unknown>;

/** Represents a GeoJSON Geometry object, which can be of various types. */
export interface GeometryObject {
  type: string;
  properties?: GeoJsonProperties;
  geometry?: Geometry;
  geometries?: GeometryObject[];
}

/** Represents a TopoJSON Topology object. */
export interface Topology {
  type: "Topology";
  objects: { [key: string]: GeometryObject };
  arcs?: unknown;
  transform?: unknown;
}

/** Configuration options for map projection */
export interface ProjectionConfig {
  center?: Coordinates;
  rotate?: [number, number, number];
  parallels?: [number, number];
  scale?: number;
}

/** Represents a geographical feature with additional SVG path and key properties. */
export interface GeographyFeature extends Feature<
  Geometry,
  Record<string, unknown>
> {
  svgPath: string;
  rsmKey: string;
}

/** Represents a collection of geographical features. */
export type GeoData = FeatureCollection<
  Geometry,
  { [key: string]: unknown } | null
> | null;

/** Represents a zoom event with transformation details. */
export type ZoomEvent = {
  transform: ZoomTransform;
  sourceEvent?: Event;
};
