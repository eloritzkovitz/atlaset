import { useEffect, useRef, useState, useContext } from "react";
import {
  zoom as d3Zoom,
  zoomIdentity as d3ZoomIdentity,
  ZoomTransform,
  type ZoomBehavior,
} from "d3-zoom";
import { select as d3Select, type Selection } from "d3-selection";
import { MapContext } from "../providers/MapContext";
import { getCoords } from "../utils/map";
import type { ZoomEvent } from "../types";

export interface UseZoomPanOptions {
  center: [number, number];
  filterZoomEvent?: (event: ZoomEvent) => boolean;
  onMoveStart?: (
    params: { coordinates: [number, number]; zoom: number },
    event?: ZoomEvent
  ) => void;
  onMoveEnd?: (
    params: { coordinates: [number, number]; zoom: number },
    event?: ZoomEvent
  ) => void;
  onMove?: (
    params: { x: number; y: number; zoom: number },
    event?: ZoomEvent
  ) => void;
  translateExtent?: [[number, number], [number, number]];
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
export default function useZoomPan({
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

  // Ensure context is available
  if (!ctx) throw new Error("useZoomPan must be used within a MapProvider");

  const { width, height, projection } = ctx;
  if (width == null || height == null) {
    throw new Error("MapProvider must provide width and height");
  }
  const [lon, lat] = center;
  const [position, setPosition] = useState<{ x: number; y: number; k: number }>(
    { x: 0, y: 0, k: 1 }
  );
  const lastPosition = useRef<{ x: number; y: number; k: number }>({
    x: 0,
    y: 0,
    k: 1,
  });
  const mapRef = useRef<SVGGElement | null>(null);
  const zoomRef = useRef<ZoomBehavior<Element, unknown> | null>(null);
  const bypassEvents = useRef(false);

  const [a, b] = translateExtent ?? [
    [0, 0],
    [0, 0],
  ];
  const [a1 = 0, a2 = 0] = a ?? [0, 0];
  const [b1 = 0, b2 = 0] = b ?? [0, 0];
  const [minZoom = 1, maxZoom = 8] = scaleExtent ?? [1, 8];

  // Initialize zoom behavior
  useEffect(() => {
    if (!mapRef.current) return;
    const svg: Selection<Element, unknown, null, undefined> = d3Select(
      mapRef.current as Element
    );

    // Handle zoom start event
    function handleZoomStart(event: ZoomEvent) {
      if (!onMoveStart || bypassEvents.current) return;
      let coords: [number, number] = [0, 0];
      if (typeof projection.invert === "function") {
        coords = projection.invert(
          getCoords(width, height, event.transform)
        ) as [number, number];
      }
      onMoveStart(
        {
          coordinates: coords,
          zoom: event.transform.k,
        },
        event
      );
    }

    // Handle zoom/move event
    function handleZoom(event: ZoomEvent) {
      if (bypassEvents.current) return;
      const { transform } = event;
      setPosition({
        x: transform.x,
        y: transform.y,
        k: transform.k,
      });
      if (!onMove) return;
      onMove(
        {
          x: transform.x,
          y: transform.y,
          zoom: transform.k,
        },
        event
      );
    }

    // Handle zoom end event
    function handleZoomEnd(event: ZoomEvent) {
      if (bypassEvents.current) {
        bypassEvents.current = false;
        return;
      }
      let coords: [number, number] = [0, 0];
      if (typeof projection.invert === "function") {
        coords = projection.invert(
          getCoords(width, height, event.transform)
        ) as [number, number];
      }
      const [x, y] = coords;
      lastPosition.current = { x, y, k: event.transform.k };
      if (!onMoveEnd) return;
      onMoveEnd({ coordinates: [x, y], zoom: event.transform.k }, event);
    }

    // Define filter function for zoom events
    function filterFunc(event: ZoomEvent) {
      if (filterZoomEvent) {
        return filterZoomEvent(event);
      }
      const sourceEvent = event.sourceEvent;
      if (!sourceEvent) return true;
      if (sourceEvent instanceof WheelEvent) return true;
      if (sourceEvent instanceof MouseEvent) {
        // Block right-click and ctrl+drag, allow left-click and wheel
        return !sourceEvent.ctrlKey && sourceEvent.button === 0;
      }
      return true;
    }

    // Create zoom behavior
    const zoom: ZoomBehavior<Element, unknown> = d3Zoom<Element, unknown>()
      .filter(filterFunc)
      .scaleExtent([Number(minZoom), Number(maxZoom)])
      .translateExtent([
        [Number(a1), Number(a2)],
        [Number(b1), Number(b2)],
      ])
      .on(
        "start",
        handleZoomStart as unknown as (this: Element, event: unknown) => void
      )
      .on(
        "zoom",
        handleZoom as unknown as (this: Element, event: unknown) => void
      )
      .on(
        "end",
        handleZoomEnd as unknown as (this: Element, event: unknown) => void
      );

    zoomRef.current = zoom;
    svg.call(zoom);
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
    onMoveStart,
    onMove,
    onMoveEnd,
    filterZoomEvent,
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

    // If projection fails, do nothing
    if (!coords) return;

    // Apply zoom and pan
    const x = coords[0] * zoom;
    const y = coords[1] * zoom;

    // Ensure mapRef is available
    if (!mapRef.current) return;
    const svg = d3Select(mapRef.current as Element);

    bypassEvents.current = true;

    svg.call(
      zoomRef.current!.transform as (
        selection: Selection<Element, unknown, null, undefined>,
        transform: ZoomTransform
      ) => void,
      d3ZoomIdentity.translate(width / 2 - x, height / 2 - y).scale(zoom)
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
