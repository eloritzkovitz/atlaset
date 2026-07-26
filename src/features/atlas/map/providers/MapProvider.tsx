import { useMemo, type ReactNode } from "react";
import * as d3Geo from "d3-geo";
const { geoPath } = d3Geo;
import { MapContext } from "./MapContext";
import type { ProjectionConfig } from "../types";
import { makeProjection } from "../utils/projection";

export interface MapProviderProps {
  width?: number;
  height?: number;
  projection?: string | ((...args: unknown[]) => d3Geo.GeoProjection);
  projectionConfig?: ProjectionConfig;
  className?: string;
  children?: ReactNode;
  [key: string]: unknown;
}

export interface MapContextValue {
  width: number;
  height: number;
  projection: d3Geo.GeoProjection;
  path: d3Geo.GeoPath;
}

/**
 * Creates a MapProvider that sets up the map context with projection and path.
 * @param width - Width of the map.
 * @param height - Height of the map.
 * @param projection - The projection type as a string or a custom projection function.
 * @param projectionConfig - Configuration options for the projection.
 * @param children - Child components that will consume the map context.
 * @returns
 */
export const MapProvider = ({
  width = 800,
  height = 600,
  projection = "geoEqualEarth",
  projectionConfig = {},
  children,
  ...restProps
}: MapProviderProps) => {
  const projMemo = useMemo(() => {
    return makeProjection({
      projectionConfig,
      projection,
      width,
      height,
    });
  }, [width, height, projection, projectionConfig]);

  const value = useMemo<MapContextValue>(() => {
    return {
      width,
      height,
      projection: projMemo,
      path: geoPath().projection(projMemo),
    };
  }, [width, height, projMemo]);

  return (
    <MapContext.Provider value={value} {...restProps}>
      {children}
    </MapContext.Provider>
  );
};
