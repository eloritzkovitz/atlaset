import { useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import type { Location } from "@lib/locations";
import { MapBoundsController } from "./MapBoundsController";
import { MapLocationController } from "./MapLocationController";
import "leaflet/dist/leaflet.css";

interface TripLocationsMapProps {
  locations: Location[];
  selectedLocationId?: number;
  onLocationSelect?: (locationId: number) => void;
}

export function TripLocationsMap({
  locations,
  selectedLocationId,
  onLocationSelect,
}: TripLocationsMapProps) {
  const mapRef = useRef<LeafletMap | null>(null);

  if (locations.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center rounded-lg bg-surface">
        <p className="text-muted">No locations to display.</p>
      </div>
    );
  }

  const firstLocation = locations[0];

  return (
    <MapContainer
      ref={mapRef}
      center={[firstLocation.latitude, firstLocation.longitude]}
      zoom={5}
      className="h-[360px] w-full rounded-lg lg:h-full lg:min-h-[420px]"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapBoundsController locations={locations} />

      <MapLocationController
        locations={locations}
        selectedLocationId={selectedLocationId}
      />

      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.latitude, location.longitude]}
          eventHandlers={{
            click: () => {
              onLocationSelect?.(location.id);
            },
          }}
        >
          <Popup>
            <strong>{location.name}</strong>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
