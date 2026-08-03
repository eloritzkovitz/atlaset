/**
 * Utilities for parsing, normalizing, importing, and exporting JSON data.
 */

import { downloadBlob } from "./download";

/**
 * Parse and normalize one or more items from JSON string or object.
 * @param jsonOrObj - JSON string or object.
 * @param normalizeFn - Function to normalize each item.
 * @returns Array of normalized items.
 */
export function parseAndNormalize<T extends Record<string, unknown>>(
  jsonOrObj: string | object,
  normalizeFn: (obj: Record<string, unknown>) => T,
): T[] {
  const obj = typeof jsonOrObj === "string" ? JSON.parse(jsonOrObj) : jsonOrObj;
  if (Array.isArray(obj)) {
    return obj.map((item) => normalizeFn(item as Record<string, unknown>));
  }
  return [normalizeFn(obj as Record<string, unknown>)];
}

/**
 * Serialize one or more items to a pretty JSON string, omitting specified fields.
 * @param items - Array or single item.
 * @param omitFields - Fields to omit from each item.
 */
export function serializeItems<T extends Record<string, unknown>>(
  items: T | T[],
  omitFields: (keyof T | string)[] = [],
): string {
  const arr = Array.isArray(items) ? items : [items];
  const cleaned = arr.map((item) => {
    const rest: Record<string, unknown> = { ...item };
    for (const field of omitFields) {
      delete rest[field as string];
    }
    return rest;
  });
  return JSON.stringify(cleaned, null, 2);
}

/**
 * Import items from a JSON file input event.
 * @param event - File input change event.
 * @param parseFn - Function to parse and normalize items.
 * @param callback - Callback with array of items.
 */
export async function importFromFile<T extends Record<string, unknown>>(
  event: React.ChangeEvent<HTMLInputElement>,
  parseFn: (json: string) => T[],
  callback: (items: T[]) => void,
  onError?: (error: Error) => void,
): Promise<void> {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    const items = parseFn(text);
    callback(items);
  } catch (err) {
    const error = err instanceof Error ? err : new Error("Invalid JSON file.");
    if (onError) {
      onError(error);
    } else {
      console.error("importFromFile error:", error);
    }
  } finally {
    event.target.value = "";
  }
}

/**
 * Export items to a JSON file.
 * @param items - Array or single item.
 * @param filename - Filename for download.
 * @param omitFields - Fields to omit from each item.
 * @param defaultName - Default name if filename not provided.
 */
export function exportToFile<
  T extends Record<string, unknown> & { name?: unknown },
>(
  items: T | T[],
  filename?: string,
  omitFields: (keyof T | string)[] = [],
  defaultName = "items",
): void {
  if (!items) return;
  const arr = Array.isArray(items) ? items : [items];
  const pretty = serializeItems(arr, omitFields);
  const blob = new Blob([pretty], { type: "application/json" });

  const downloadName =
    filename ||
    (arr.length === 1
      ? `${String(arr[0]?.name || defaultName)}.json`
      : `${defaultName}s.json`);

  downloadBlob(blob, downloadName, true);
}
