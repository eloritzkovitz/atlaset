import { useState, useCallback } from "react";

/**
 * Manages the readiness state of the map component.
 * @param delay - Delay in milliseconds before setting the map as ready.
 * @returns An object containing the mapReady state and a handleMapReady callback.
 */
export function useMapReady(delay = 150) {
  const [mapReady, setMapReady] = useState(false);

  // Callback to set map as ready after a delay
  const handleMapReady = useCallback(() => {
    setTimeout(() => setMapReady(true), delay);
  }, [delay]);
  
  return { mapReady, handleMapReady };
}
