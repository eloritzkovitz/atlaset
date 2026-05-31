import {
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import {
  zoom as d3Zoom,
  zoomIdentity as d3ZoomIdentity,
  ZoomTransform,
  type ZoomBehavior,
} from "d3-zoom";
import { select as d3Select, type Selection } from "d3-selection";
import { MapContext } from "../providers/MapContext";
import { getSvgCoordsFromTransform } from "../utils/projection";
import type { Coordinates, ZoomEvent } from "../types";

export interface UseZoomPanOptions {
  center: Coordinates;
  filterZoomEvent?: (event: ZoomEvent) => boolean;
  onMoveStart?: (
    params: { coordinates: Coordinates; zoom: number },
    event: ZoomEvent,
  ) => void;
  onMoveEnd?: (
    params: { coordinates: Coordinates; zoom: number },
    event: ZoomEvent,
  ) => void;
  onMove?: (
    params: { x: number; y: number; zoom: number },
    event: ZoomEvent,
  ) => void;
  translateExtent?: [Coordinates, Coordinates];
  scaleExtent?: [number, number];
  zoom?: number;
}

/**
 * Manages zooming and panning behavior for a map.
 * @param center - The center coordinates [longitude, latitude].
 * @param filterZoomEvent - Optional function to filter zoom events.
 * @param onMoveStart - Optional callback for when a move starts.
 * @param onMoveEnd - Optional callback for when a move ends.
 * @param onMove - Optional callback for when a move occurs.
 * @param translateExtent - Optional extent for panning [[x0, y0], [x1, y1]].
 * @param scaleExtent - Optional zoom scale limits [minZoom, maxZoom].
 * @param zoom - The current zoom level.
 * @returns An object containing mapRef, position, and transformString.
 */
export function useZoomPan({
  center,
  filterZoomEvent,
  onMoveStart,
  onMoveEnd,
  onMove,
  translateExtent = [
    [-Infinity, -Infinity],
    [Infinity, Infinity],
  ],
  scaleExtent = [1, 8],
  zoom = 1,
}: UseZoomPanOptions) {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error("useZoomPan must be used within a MapProvider");

  const { width, height, projection: projectionRaw } = ctx;
  if (width == null || height == null)
    throw new Error("MapProvider must provide width and height");

  // Memoize projection to avoid unnecessary re-creation
  const projection = useMemo(() => projectionRaw, [projectionRaw]);

  const [lon, lat] = center;
  const [position, setPosition] = useState<{ x: number; y: number; k: number }>(
    { x: 0, y: 0, k: 1 },
  );
  const lastPosition = useRef<{ x: number; y: number; k: number }>({
    x: 0,
    y: 0,
    k: 1,
  });
  const mapRef = useRef<SVGGElement | null>(null);
  const zoomRef = useRef<ZoomBehavior<Element, unknown> | null>(null);
  const bypassEvents = useRef(false);

  const [[a1, a2], [b1, b2]]: [Coordinates, Coordinates] = translateExtent;
  const [minZoom, maxZoom] = scaleExtent;

  // Stable filter function
  const filterFunc = useCallback(
    (event: ZoomEvent) => {
      if (filterZoomEvent) return filterZoomEvent(event);
      const sourceEvent = event.sourceEvent;
      if (!sourceEvent) return true;
      if (sourceEvent instanceof WheelEvent) return true;
      if (sourceEvent instanceof MouseEvent)
        return !sourceEvent.ctrlKey && sourceEvent.button === 0;
      return true;
    },
    [filterZoomEvent],
  );

  // Event handlers
  const handleZoomStart = useCallback(
    (event: ZoomEvent) => {
      if (!onMoveStart || bypassEvents.current) return;
      let coords: Coordinates = [0, 0];
      if (typeof projection.invert === "function") {
        coords = projection.invert(
          getSvgCoordsFromTransform(width, height, event.transform),
        ) as Coordinates;
      }
      onMoveStart({ coordinates: coords, zoom: event.transform.k }, event);
    },
    [onMoveStart, projection, width, height],
  );

  const handleZoom = useCallback(
    (event: ZoomEvent) => {
      if (bypassEvents.current) return;
      const { x, y, k } = event.transform;
      setPosition({ x, y, k });
      if (onMove) onMove({ x, y, zoom: k }, event);
    },
    [onMove],
  );

  const handleZoomEnd = useCallback(
    (event: ZoomEvent) => {
      if (bypassEvents.current) {
        bypassEvents.current = false;
        return;
      }
      let coords: Coordinates = [0, 0];
      if (typeof projection.invert === "function") {
        coords = projection.invert(
          getSvgCoordsFromTransform(width, height, event.transform),
        ) as Coordinates;
      }
      const [x, y] = coords;
      lastPosition.current = { x, y, k: event.transform.k };
      if (onMoveEnd)
        onMoveEnd({ coordinates: coords, zoom: event.transform.k }, event);
    },
    [onMoveEnd, projection, width, height],
  );

  // Initialize zoom behavior
  useEffect(() => {
    if (!mapRef.current) return;
    const svg: Selection<Element, unknown, null, undefined> = d3Select(
      mapRef.current as Element,
    );
    const zoom: ZoomBehavior<Element, unknown> = d3Zoom<Element, unknown>()
      .filter(filterFunc)
      .scaleExtent([minZoom, maxZoom])
      .translateExtent([
        [a1, a2],
        [b1, b2],
      ])
      .on(
        "start",
        handleZoomStart as unknown as (this: Element, event: unknown) => void,
      )
      .on(
        "zoom",
        handleZoom as unknown as (this: Element, event: unknown) => void,
      )
      .on(
        "end",
        handleZoomEnd as unknown as (this: Element, event: unknown) => void,
      );
    zoomRef.current = zoom;
    svg.call(zoom);

    // Cleanup on unmount
    return () => {
      try {
        // remove all listeners in the zoom namespace
        svg.on(".zoom", null);
      } catch {
        /* ignore cleanup errors */
      }
      zoomRef.current = null;
    };
  }, [
    width,
    height,
    a1,
    a2,
    b1,
    b2,
    minZoom,
    maxZoom,
    projection,
    handleZoomStart,
    handleZoom,
    handleZoomEnd,
    filterFunc,
  ]);

  // Update zoom/pan when center or zoom level changes
  useEffect(() => {
    if (
      lon === lastPosition.current.x &&
      lat === lastPosition.current.y &&
      zoom === lastPosition.current.k
    )
      return;
    const coords = projection([lon, lat]);
    if (!coords) return;
    const x = coords[0] * zoom;
    const y = coords[1] * zoom;
    if (!mapRef.current) return;
    const svg = d3Select(mapRef.current as Element);
    bypassEvents.current = true;
    svg.call(
      zoomRef.current!.transform as (
        selection: Selection<Element, unknown, null, undefined>,
        transform: ZoomTransform,
      ) => void,
      d3ZoomIdentity.translate(width / 2 - x, height / 2 - y).scale(zoom),
    );
    setPosition({ x: width / 2 - x, y: height / 2 - y, k: zoom });
    lastPosition.current = { x: lon, y: lat, k: zoom };
  }, [lon, lat, zoom, width, height, projection]);

  return {
    mapRef,
    position,
    transformString: `translate(${position.x} ${position.y}) scale(${position.k})`,
  };
}
