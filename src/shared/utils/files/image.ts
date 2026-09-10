/**
 * Utility functions for image file handling, including compression and resizing.
 */

const DEFAULT_MAX_DIMENSION = 2048;
const DEFAULT_QUALITY = 0.85;
const DEFAULT_OUTPUT_TYPE = "image/webp";

export type ImageOutputType = "image/webp" | "image/jpeg";

export interface CompressImageOptions {
  maxDimension?: number;
  quality?: number;
  outputType?: ImageOutputType;
}

/**
 * Compresses an image file by resizing and adjusting its quality.
 * @param file - The image file to compress.
 * @param options - Optional settings for compression.
 * @returns A Promise that resolves to the compressed image file.
 * @throws An error if compression fails.
 * Non-image files are returned unchanged.
 */
export async function compressImage(
  file: File,
  options: CompressImageOptions = {},
): Promise<File> {
  if (!file.type.startsWith("image/")) {
    return file;
  }

  const maxDimension = options.maxDimension ?? DEFAULT_MAX_DIMENSION;

  const quality = options.quality ?? DEFAULT_QUALITY;

  const outputType = options.outputType ?? DEFAULT_OUTPUT_TYPE;

  validateOptions(maxDimension, quality);

  const image = await loadImage(file);

  const { width, height } = calculateDimensions(
    image.naturalWidth,
    image.naturalHeight,
    maxDimension,
  );

  const canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to create image processing context");
  }

  context.drawImage(image, 0, 0, width, height);

  const blob = await canvasToBlob(canvas, outputType, quality);

  return new File([blob], createOutputFileName(file.name, outputType), {
    type: outputType,
    lastModified: Date.now(),
  });
}

/**
 * Validates the compression options.
 * @param maxDimension - The maximum dimension (width or height) for the compressed image.
 * @param quality - The quality factor for the compressed image (between 0 and 1).
 * @throws An error if the options are invalid.
 */
function validateOptions(maxDimension: number, quality: number): void {
  if (!Number.isFinite(maxDimension) || maxDimension <= 0) {
    throw new Error("maxDimension must be greater than zero");
  }

  if (!Number.isFinite(quality) || quality < 0 || quality > 1) {
    throw new Error("quality must be between 0 and 1");
  }
}

/**
 * Loads an image from a File object and returns an HTMLImageElement.
 * @param file - The image file to load.
 * @returns A Promise that resolves to the loaded HTMLImageElement.
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    const cleanup = () => URL.revokeObjectURL(url);

    image.onload = () => {
      cleanup();
      resolve(image);
    };

    image.onerror = () => {
      cleanup();
      reject(new Error("Unable to load image"));
    };

    image.src = url;
  });
}

/**
 * Calculates the new dimensions for an image while maintaining its aspect ratio.
 * @param originalWidth - The original width of the image.
 * @param originalHeight - The original height of the image.
 * @param maxDimension - The maximum dimension (width or height) for the resized image.
 * @returns An object containing the new width and height for the image.
 */
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxDimension: number,
): { width: number; height: number } {
  const largestDimension = Math.max(originalWidth, originalHeight);

  if (largestDimension <= maxDimension) {
    return {
      width: originalWidth,
      height: originalHeight,
    };
  }

  const scale = maxDimension / largestDimension;

  return {
    width: Math.round(originalWidth * scale),
    height: Math.round(originalHeight * scale),
  };
}

/**
 * Converts a canvas to a Blob object with the specified MIME type and quality.
 * @param canvas - The HTMLCanvasElement to convert.
 * @param type - The MIME type for the output image (e.g., "image/webp" or "image/jpeg").
 * @param quality - The quality factor for the output image (between 0 and 1).
 * @returns A Promise that resolves to the resulting Blob object.
 */
function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: ImageOutputType,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Unable to encode image"));
          return;
        }

        resolve(blob);
      },
      type,
      quality,
    );
  });
}

/**
 * Creates a new file name for the output image.
 * @param originalName - The original name of the image file.
 * @param outputType - The type of the output image (e.g., "image/webp" or "image/jpeg").
 * @returns The new file name for the output image.
 */
function createOutputFileName(
  originalName: string,
  outputType: ImageOutputType,
): string {
  const extension = outputType === "image/webp" ? "webp" : "jpg";

  const nameWithoutExtension = originalName.replace(/\.[^/.]+$/, "");

  return `${nameWithoutExtension}.${extension}`;
}
