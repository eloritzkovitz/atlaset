import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getUploadableFiles } from "@utils";
import {
  ACCEPTED_TRIP_PHOTO_TYPES,
  MAX_TRIP_PHOTOS,
} from "../constants/tripPhotos";
import { tripPhotosService } from "../services/tripPhotosService";
import type { TripPhoto } from "../types";

interface UseTripPhotoManagerOptions {
  tripId: string;
  photos: TripPhoto[];
  onChange?: (photos: TripPhoto[]) => void;
  enabled?: boolean;
}

/**
 * Manages the state and actions for uploading and removing trip photos.
 */
export function useTripPhotoManager({
  tripId,
  photos,
  onChange,
  enabled = true,
}: UseTripPhotoManagerOptions) {
  const { t } = useTranslation("trips");
  const [isUploading, setIsUploading] = useState(false);
  const [removingPhotoId, setRemovingPhotoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canUpload = enabled && photos.length < MAX_TRIP_PHOTOS;

  // Handle file uploads
  const handleFiles = async (files: File[]): Promise<void> => {
    if (files.length === 0 || !canUpload || isUploading) {
      return;
    }

    setError(null);
    const availableSlots = MAX_TRIP_PHOTOS - photos.length;
    const imageFiles = getUploadableFiles(
      files,
      ACCEPTED_TRIP_PHOTO_TYPES,
      availableSlots,
    );

    if (imageFiles.length === 0) {
      setError(t("editor.photos.invalidFileType"));
      return;
    }

    setIsUploading(true);

    try {
      const results = await Promise.allSettled(
        imageFiles.map((file) => tripPhotosService.upload(tripId, file)),
      );
      const uploadedPhotos = results
        .filter(
          (result): result is PromiseFulfilledResult<TripPhoto> =>
            result.status === "fulfilled",
        )
        .map((result) => result.value);
      const hasFailures = results.some(
        (result) => result.status === "rejected",
      );

      if (uploadedPhotos.length > 0) {
        onChange?.([...photos, ...uploadedPhotos]);
      }

      if (hasFailures) {
        setError(t("editor.photos.uploadError"));
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Handle photo removal
  const handleRemove = async (photo: TripPhoto): Promise<void> => {
    if (!enabled || removingPhotoId !== null) {
      return;
    }

    setError(null);
    setRemovingPhotoId(photo.publicId);

    try {
      await tripPhotosService.delete(tripId, photo.publicId);
      onChange?.(photos.filter((item) => item.publicId !== photo.publicId));
    } catch {
      setError(t("editor.photos.deleteError"));
    } finally {
      setRemovingPhotoId(null);
    }
  };

  return {
    canUpload,
    error,
    handleFiles,
    handleRemove,
    isUploading,
    removingPhotoId,
  };
}
