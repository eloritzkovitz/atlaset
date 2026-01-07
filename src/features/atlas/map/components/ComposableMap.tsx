import { forwardRef, type ReactNode, type SVGProps } from "react";
import type { GeoProjection } from "d3-geo";
import { MapProvider } from "../providers/MapProvider";
import type { ProjectionConfig } from "../types";

export interface ComposableMapProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  width?: number;
  height?: number;
  projection?: string | ((...args: unknown[]) => GeoProjection);
  projectionConfig?: ProjectionConfig;
  className?: string;
  children?: ReactNode;
}

export const ComposableMap = forwardRef<SVGSVGElement, ComposableMapProps>(
  (
    {
      width = 800,
      height = 600,
      projection = "geoEqualEarth",
      projectionConfig = undefined,
      className = "",
      children,
      ...restProps
    },
    ref
  ) => {
    return (
      <MapProvider
        width={width}
        height={height}
        projection={projection}
        projectionConfig={projectionConfig}
      >
        <svg
          ref={ref}
          viewBox={`0 0 ${width} ${height}`}
          className={`rsm-svg ${className}`}
          width={width}
          height={height}
          {...restProps}
        >
          {children}
        </svg>
      </MapProvider>
    );
  }
);

ComposableMap.displayName = "ComposableMap";
