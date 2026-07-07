import React, { forwardRef } from "react";
import type { GeoPath, GeoProjection } from "d3-geo";
import { useGeographies } from "../hooks/useGeographies";
import { useMapContext } from "../providers/MapContext";
import type { GeographyFeature } from "../types";

export interface GeographiesProps {
  geography: unknown;
  children: (args: {
    geographies: GeographyFeature[];
    outline?: GeographyFeature;
    borders?: GeographyFeature;
    path: GeoPath<GeographyFeature, GeographyFeature>;
    projection: GeoProjection;
  }) => React.ReactNode;
  parseGeographies?: (geography: unknown) => GeographyFeature[];
  className?: string;
  style?: React.CSSProperties;
}

export const Geographies = forwardRef<SVGGElement, GeographiesProps>(
  (props, ref) => {
    const {
      geography,
      children,
      parseGeographies,
      className = "",
      ...restProps
    } = props;
    const { path, projection } = useMapContext();
    const { geographies, outline, borders } = useGeographies({
      geography,
      parseGeographies,
    });

    return (
      <g ref={ref} className={`rsm-geographies ${className}`} {...restProps}>
        {geographies &&
          geographies.length > 0 &&
          children({ geographies, outline, borders, path, projection })}
      </g>
    );
  },
);

Geographies.displayName = "Geographies";
