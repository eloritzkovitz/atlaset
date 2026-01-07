import { useContext, forwardRef, type ReactNode } from "react";
import useZoomPan from "../hooks/useZoomPan";
import { MapContext } from "../providers/MapContext";
import { ZoomPanProvider } from "../providers/ZoomPanProvider";
import type { ZoomEvent } from "../types";

export interface ZoomableGroupProps {
  center?: [number, number];
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  translateExtent?: [[number, number], [number, number]];
  filterZoomEvent?: (event: ZoomEvent) => boolean;
  onMoveStart?: () => void;
  onMove?: (position: { x: number; y: number; k: number }) => void;
  onMoveEnd?: (position: { x: number; y: number; k: number }) => void;
  className?: string;
  children?: ReactNode;
  [key: string]: unknown;
}

export const ZoomableGroup = forwardRef<SVGGElement, ZoomableGroupProps>(
  (
    {
      center = [0, 0],
      zoom = 1,
      minZoom = 1,
      maxZoom = 8,
      translateExtent,
      filterZoomEvent,
      onMoveStart,
      onMove,
      onMoveEnd,
      className = "",
      children,
      ...restProps
    },
    ref
  ) => {
    const { width, height } = useContext(MapContext) ?? {};
    // Ensure center is always [number, number]
    const safeCenter: [number, number] =
      Array.isArray(center) && center.length === 2
        ? [Number(center[0]), Number(center[1])]
        : [0, 0];
    const safeMinZoom =
      typeof minZoom === "number" && !isNaN(minZoom) ? minZoom : 1;
    const safeMaxZoom =
      typeof maxZoom === "number" && !isNaN(maxZoom) ? maxZoom : 8;
    const safeZoom = typeof zoom === "number" && !isNaN(zoom) ? zoom : 1;
    const safeTranslateExtent =
      Array.isArray(translateExtent) &&
      translateExtent.length === 2 &&
      Array.isArray(translateExtent[0]) &&
      Array.isArray(translateExtent[1]) &&
      translateExtent[0].length === 2 &&
      translateExtent[1].length === 2
        ? (translateExtent as [[number, number], [number, number]])
        : undefined;
    const { mapRef, transformString, position } = useZoomPan({
      center: safeCenter,
      filterZoomEvent: filterZoomEvent as
        | ((event: ZoomEvent) => boolean)
        | undefined,
      onMoveStart: onMoveStart as
        | ((
            params: { coordinates: [number, number]; zoom: number },
            event?: ZoomEvent
          ) => void)
        | undefined,
      onMove: onMove as
        | ((
            params: { x: number; y: number; zoom: number },
            event?: ZoomEvent
          ) => void)
        | undefined,
      onMoveEnd: onMoveEnd as
        | ((
            params: { coordinates: [number, number]; zoom: number },
            event?: ZoomEvent
          ) => void)
        | undefined,
      scaleExtent: [safeMinZoom, safeMaxZoom],
      translateExtent: safeTranslateExtent,
      zoom: safeZoom,
    });

    return (
      <ZoomPanProvider
        value={{ x: position.x, y: position.y, k: position.k, transformString }}
      >
        <g ref={mapRef}>
          <rect width={width} height={height} fill="transparent" />
          <g
            ref={ref}
            transform={transformString}
            className={`rsm-zoomable-group ${className}`}
            {...restProps}
          >
            {typeof children === "string" ||
            typeof children === "number" ||
            Array.isArray(children) ||
            (children && typeof (children as object) === "object")
              ? (children as ReactNode)
              : null}
          </g>
        </g>
      </ZoomPanProvider>
    );
  }
);

ZoomableGroup.displayName = "ZoomableGroup";
