import type { FeatureCollection, Geometry } from "geojson";

export type GeoData = FeatureCollection<
  Geometry,
  { [key: string]: unknown } | null
> | null;
