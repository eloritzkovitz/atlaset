import { useTranslation } from "react-i18next";
import { FaSpinner } from "react-icons/fa6";
import { ActionButton, Card, FileDropzone, ImageGallery } from "@components";
import { ICONS } from "@constants/icons";
import { TRIP_PHOTO_ACCEPT } from "../constants/tripPhotos";
import { MAX_TRIP_PHOTOS } from "../constants/tripPhotos";
import { useTripPhotoManager } from "../hooks/useTripPhotoManager";
import type { TripPhoto } from "../types";

interface TripPhotoGalleryProps {
  tripId: string;
  photos: TripPhoto[];
  onChange?: (photos: TripPhoto[]) => void;
  photoAlbumUrl?: string;
  readOnly?: boolean;
}

export function TripPhotoGallery({
  tripId,
  photos,
  onChange,
  photoAlbumUrl,
  readOnly = false,
}: TripPhotoGalleryProps) {
  const { t } = useTranslation("trips");
  const {
    canUpload,
    error,
    handleFiles,
    handleRemove,
    isUploading,
    removingPhotoId,
  } = useTripPhotoManager({
    tripId,
    photos,
    onChange,
    enabled: !readOnly,
  });

  return (
    <Card
      title={t("gallery.title", "Gallery")}
      actions={
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted">
            {photos.length}/{MAX_TRIP_PHOTOS}
          </span>
          <ActionButton
            url={photoAlbumUrl}
            icon={<ICONS.photoAlbum aria-hidden="true" />}
            ariaLabel={t("gallery.openAlbum", "Open photo album")}
            title={
              photoAlbumUrl
                ? t("gallery.openAlbum", "Open photo album")
                : t("gallery.noAlbum", "No photo album linked")
            }
            disabled={!readOnly || !photoAlbumUrl}
            rounded
            className={!photoAlbumUrl ? "text-muted" : ""}
          />
        </div>
      }
    >
      {error && (
        <p className="mt-3 text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      {photos.length > 0 && (
        <ImageGallery
          images={photos.map((photo, index) => ({
            src: photo.secureUrl,
            alt: t("editor.photos.photoAlt", "Trip photo {index}", {
              index: index + 1,
            }),
          }))}
          renderOverlay={
            !readOnly
              ? (index) => {
                  const photo = photos[index];

                  if (!photo) {
                    return null;
                  }

                  return (
                    <ActionButton
                      ariaLabel={t("actions.remove", "Remove")}
                      disabled={isUploading || removingPhotoId !== null}
                      variant="custom"
                      rounded
                      icon={
                        removingPhotoId === photo.publicId ? (
                          <FaSpinner
                            className="h-4 w-4 animate-spin"
                            aria-hidden="true"
                          />
                        ) : (
                          <ICONS.remove
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                        )
                      }
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-md bg-black/65 text-white opacity-100 shadow-sm transition-opacity hover:bg-danger focus-visible:opacity-100 disabled:cursor-not-allowed disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100"
                      onClick={() => void handleRemove(photo)}
                    />
                  );
                }
              : undefined
          }
        />
      )}

      {canUpload && (
        <FileDropzone
          accept={TRIP_PHOTO_ACCEPT}
          disabled={isUploading}
          onFiles={(files) => void handleFiles(files)}
          hint={t("editor.photos.fileHint", { max: MAX_TRIP_PHOTOS })}
        />
      )}

      {!readOnly && !canUpload && (
        <p className="mt-4 text-sm text-muted">
          {t("editor.photos.limitReached", { max: MAX_TRIP_PHOTOS })}
        </p>
      )}
    </Card>
  );
}
