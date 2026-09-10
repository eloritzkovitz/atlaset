import { backendFetch } from "@lib/api-client";
import {
  uploadImageToCloudinary,
  type CloudinaryUploadSignature,
} from "@lib/cloudinary";
import { compressImage } from "@utils";
import type { TripPhoto } from "../types";

/**
 * Service for managing trip photos, including uploading and deleting photos.
 */
export const tripPhotosService = {
  async upload(tripId: string, file: File): Promise<TripPhoto> {
    const signature = await this.getUploadSignature(tripId);

    const optimizedFile = await compressImage(file);

    const uploaded = await uploadImageToCloudinary(optimizedFile, signature);

    return {
      publicId: uploaded.publicId,
      secureUrl: uploaded.secureUrl,
      width: uploaded.width,
      height: uploaded.height,
    };
  },

  async delete(tripId: string, publicId: string): Promise<void> {
    const response = await backendFetch("/media/image", {
      method: "DELETE",
      body: JSON.stringify({
        tripId,
        publicId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete trip photo");
    }
  },

  async getUploadSignature(tripId: string): Promise<CloudinaryUploadSignature> {
    const response = await backendFetch("/media/upload-signature", {
      method: "POST",
      body: JSON.stringify({
        tripId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get photo upload signature");
    }

    return (await response.json()) as CloudinaryUploadSignature;
  },
};
