/**
 * Utility functions for uploading files.
 */

/**
 * Filters the provided files based on accepted MIME types and limits the number of files to the available slots.
 * @param files - An array of File objects to filter.
 * @param acceptedTypes - A set of accepted MIME types for filtering the files.
 * @param availableSlots - The number of available slots for uploading files.
 * @returns An array of File objects that are valid for upload based on the accepted types and available slots.
 */
export function getUploadableFiles(
  files: File[],
  acceptedTypes: ReadonlySet<string>,
  availableSlots: number,
): File[] {
  return files
    .filter((file) => acceptedTypes.has(file.type))
    .slice(0, Math.max(availableSlots, 0));
}
