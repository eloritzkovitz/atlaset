import { useTranslation } from "react-i18next";
import {
  ActionButton,
  Card,
  EmptyListMessage,
  ErrorMessage,
  FileDropzone,
  ImageGallery,
} from "@components";
import { ICONS } from "@constants/icons";
import { MAX_TRIP_PHOTOS, TRIP_PHOTO_ACCEPT } from "../constants/tripPhotos";
import { TripPhotoActions } from "./TripPhotoActions";
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
    draggedIndex,
    error,
    handleFiles,
    handleDragEnd,
    handleDragOver,
    handleDragStart,
    handleMove,
    handleRemove,
    isUploading,
    removingPhotoId,
  } = useTripPhotoManager({
    tripId,
    photos,
    onChange,
    enabled: !readOnly,
  });

  function getPhotoItemProps(index: number) {
    return {
      draggable: true,
      onPointerDown: (event: React.PointerEvent<HTMLDivElement>) =>
        event.stopPropagation(),
      onDragStart: () => handleDragStart(index),
      onDragOver: (event: React.DragEvent<HTMLDivElement>) =>
        handleDragOver(
          event as unknown as React.DragEvent<HTMLLIElement>,
          index,
        ),
      onDragEnd: handleDragEnd,
      className:
        draggedIndex === index
          ? "cursor-grabbing ring-dashed opacity-50"
          : "cursor-grab",
    };
  }

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
      {error && <ErrorMessage error={error} />}

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
                    <TripPhotoActions
                      index={index}
                      photoCount={photos.length}
                      isRemoving={removingPhotoId === photo.publicId}
                      removeDisabled={isUploading || removingPhotoId !== null}
                      onMove={(offset) => handleMove(index, offset)}
                      onRemove={() => void handleRemove(photo)}
                    />
                  );
                }
              : undefined
          }
          getItemProps={
            !readOnly ? (index) => getPhotoItemProps(index) : undefined
          }
        />
      )}

      {photos.length === 0 && readOnly && (
        <EmptyListMessage
          message={t("gallery.empty", "No photos added yet.")}
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
