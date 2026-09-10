import { useEffect } from "react";
import { LatLngBounds } from "leaflet";
import { useMap } from "react-leaflet";
import type { Location } from "@lib/locations";

interface MapBoundsControllerProps {
  locations: Location[];
}

export function MapBoundsController({ locations }: MapBoundsControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (locations.length === 0) {
      return;
    }

    if (locations.length === 1) {
      const [location] = locations;

      map.setView([location.latitude, location.longitude], 10);

      return;
    }

    const bounds = new LatLngBounds(
      locations.map((location) => [location.latitude, location.longitude]),
    );

    map.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 10,
      animate: true,
    });
  }, [locations, map]);

  return null;
}
