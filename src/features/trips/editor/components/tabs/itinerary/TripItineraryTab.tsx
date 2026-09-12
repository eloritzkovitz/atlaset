import { useTranslation } from "react-i18next";
import { FormField, InputBox } from "@components";
import type { Trip } from "../../../../core/types";

interface TripItineraryTabProps {
  trip: Trip;
  onChange: (trip: Trip) => void;
}

/** Renders the itinerary tab for a trip. */
export function TripItineraryTab({ trip, onChange }: TripItineraryTabProps) {
  const { t } = useTranslation("trips");

  return (
    <FormField label={t("fields.googleMapUrl", "Google Maps URL")}>
      <InputBox
        id="trip-google-map-url"
        name="trip-google-map-url"
        type="url"
        value={trip.googleMapsUrl ?? ""}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange({
            ...trip,
            googleMapsUrl: e.target.value || undefined,
          })
        }
        placeholder="https://www.google.com/maps/d/..."
      />
    </FormField>
  );
}
