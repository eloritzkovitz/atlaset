import { EMPTY_NUMBER_ARRAY } from "@constants/arrays";
import { LocationsSection } from "./LocationsSection";
import type { Trip } from "../../../../core/types";
import { useTripLocations } from "../../../../locations/hooks/useTripLocations";

interface TripDestinationsTabProps {
  trip: Trip;
  onEditLocations: () => void;
  onChange: (trip: Trip) => void;
}

/** Renders the destinations tab for a trip. */
export function TripDestinationsTab({
  trip,
  onEditLocations,
  onChange,
}: TripDestinationsTabProps) {
  const { locations, loading: locationsLoading } = useTripLocations(
    trip.locationIds ?? EMPTY_NUMBER_ARRAY,
  );

  return (
    <div className="flex flex-col gap-3">
      <LocationsSection
        locations={locations}
        loading={locationsLoading}
        onEdit={onEditLocations}
        onRemove={(locationId) =>
          onChange({
            ...trip,
            locationIds: (trip.locationIds ?? []).filter(
              (id) => id !== locationId,
            ),
          })
        }
      />
    </div>
  );
}
