/**
 * Utilities for formatting and checking export formats.
 */

import type { ExportFormat, ImageFormat } from "../types";

/**
 * Check if the given export format is an image format.
 * @param format
 * @returns
 */
export function isImageFormat(format: ExportFormat): format is ImageFormat {
  return format === "png" || format === "jpeg" || format === "webp";
}
