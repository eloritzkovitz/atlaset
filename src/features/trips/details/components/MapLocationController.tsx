import { useEffect } from "react";
import { useMap } from "react-leaflet";
import type { Location } from "@lib/locations";

interface MapLocationControllerProps {
  locations: Location[];
  selectedLocationId?: number;
}

export function MapLocationController({
  locations,
  selectedLocationId,
}: MapLocationControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (selectedLocationId === undefined) {
      return;
    }

    const location = locations.find((item) => item.id === selectedLocationId);

    if (!location) {
      return;
    }

    map.flyTo(
      [location.latitude, location.longitude],
      Math.max(map.getZoom(), 10),
      {
        animate: true,
        duration: 0.8,
      },
    );
  }, [locations, selectedLocationId, map]);

  return null;
}
