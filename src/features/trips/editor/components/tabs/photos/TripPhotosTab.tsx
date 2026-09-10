import { useTranslation } from "react-i18next";
import { FormField, InputBox } from "@components";
import type { Trip } from "@features/trips/core/types";
import { TripPhotoGallery } from "@features/trips/photos/components/TripPhotoGallery";

interface TripPhotosTabProps {
  trip: Trip;
  onChange: (trip: Trip) => void;
}

/** Renders the photos tab for a trip. */
export function TripPhotosTab({ trip, onChange }: TripPhotosTabProps) {
  const { t } = useTranslation("trips");

  return (
    <div className="flex flex-col gap-6">
      <FormField label={t("fields.photoAlbumUrl", "Photo album URL")}>
        <InputBox
          id="trip-photo-album-url"
          name="trip-photo-album-url"
          type="url"
          value={trip.photoAlbumUrl ?? ""}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            onChange({
              ...trip,
              photoAlbumUrl: event.target.value,
            })
          }
          placeholder={"https://example.com"}
        />
      </FormField>

      <TripPhotoGallery
        tripId={trip.id}
        photos={trip.photos ?? []}
        onChange={(photos) =>
          onChange({
            ...trip,
            photos,
          })
        }
      />
    </div>
  );
}
