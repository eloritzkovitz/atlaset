/**
 * Utilities for formatting and checking export formats.
 */

import type { ExportFormat, ImageFormat } from "../types";

/**
 * Checks if the given export format is an image format.
 * @param format - The export format to check.
 * @returns True if the format is an image format, false otherwise.
 */
export function isImageFormat(format: ExportFormat): format is ImageFormat {
  return format === "png" || format === "jpeg" || format === "webp";
}

/**
 * Returns the appropriate file extension for the given export format.
 * @param format - The export format.
 * @returns The file extension for the given export format.
 */
export function getFormatExtension(format: ExportFormat): string {
  if (format === "jpeg") return "jpg";
  return format;
}

/**
 * Returns the default filename for the given export format and scale.
 * @param format - The export format.
 * @param scale - The scale factor for image formats (optional).
 * @returns The default filename for the given export format and scale.
 */
export function getExportFilename(
  format: ExportFormat,
  scale?: number,
): string {
  const ext = getFormatExtension(format);
  if (format === "json") return "atlas-data.json";
  if (format === "svg") return "map.svg";

  // Image formats include scale signatures
  return `map@${scale ?? 3}x.${ext}`;
}
