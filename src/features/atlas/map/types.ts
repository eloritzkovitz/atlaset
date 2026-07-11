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

/** Represents a TopoJSON Topology object. */
export interface Topology {
  type: "Topology";
  objects: Record<
    string,
    { type: string; geometries?: unknown[] & { type: string }[] }
  >;
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

/** Represents a GeoJSON feature. */
export type GeoJsonFeature = Feature<Geometry, Record<string, unknown>>;

/** Represents a geographical feature with additional SVG path and key properties. */
export interface GeographyFeature extends GeoJsonFeature {
  svgPath: string;
  rsmKey: string;
}

/** Represents a collection of geographical features. */
export type GeoData = FeatureCollection<
  Geometry,
  GeoJsonProperties | null
> | null;

/** Represents a zoom event with transformation details. */
export type ZoomEvent = {
  transform: ZoomTransform;
  sourceEvent?: Event;
};
