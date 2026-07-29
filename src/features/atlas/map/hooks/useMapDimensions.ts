import { useEffect, useRef } from "react";
import { useContainerDimensions } from "@hooks";
import { useMapView } from "../context/MapViewContext";

/**
 * Manages map dimensions and container measurements.
 */
export function useMapDimensions() {
  const { dimensions, setDimensions } = useMapView();

  const containerRef = useRef<HTMLDivElement>(null);
  const measuredDimensions = useContainerDimensions(containerRef);

  useEffect(() => {
    if (measuredDimensions.width > 0 && measuredDimensions.height > 0) {
      setDimensions(measuredDimensions);
    }
  }, [measuredDimensions, setDimensions]);

  const mapWidth = dimensions.width || measuredDimensions.width || 800;
  const mapHeight = dimensions.height || measuredDimensions.height || 600;

  return { containerRef, mapWidth, mapHeight };
}
