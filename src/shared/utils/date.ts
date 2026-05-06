/**
 * Utility functions for date and time manipulation and formatting.
 */

import type { TFunction } from "i18next";

/**
 * Formats a date string into a locale-specific date representation.
 * @param dateStr - The date string to format.
 * @param locale - The locale code to format the date for. Defaults to "en-GB".
 * @returns The formatted date string.
 */
export function formatDate(dateStr?: string, locale: string = "en-GB"): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString(locale);
}

/**
 * Converts a Firestore Timestamp or string to a formatted date string.
 * @param date - Firestore Timestamp (with toDate) or string.
 * @param locale - Optional locale for formatting.
 */
export function formatFirestoreDate(
  date: unknown,
  locale: string = "en-GB",
): string {
  if (
    date &&
    typeof date === "object" &&
    date !== null &&
    typeof (date as { toDate?: unknown }).toDate === "function"
  ) {
    return formatDate(
      (date as { toDate: () => Date }).toDate().toISOString(),
      locale,
    );
  } else if (typeof date === "string" && date) {
    return formatDate(date, locale);
  }
  return "Unknown";
}

/**
 * Gets the year as a string from a date string.
 * @param date - The date string to extract the year from.
 * @returns The year as a string, or undefined if the date is not provided.
 */
export function getYear(date?: string): string | undefined {
  if (!date) return undefined;
  const d = new Date(date);
  return isNaN(d.getTime()) ? undefined : d.getFullYear().toString();
}

/**
 * Gets the current year as a number.
 * @returns The current year.
 */
export function getCurrentYear(): number {
  return new Date().getFullYear();
}

/**
 * Gets the year number from a date string.
 * @param date - The date string to extract the year from.
 * @returns The year as a number, or undefined if the date is not provided.
 */
export function getYearNumber(date?: string): number | undefined {
  if (!date) return undefined;
  const d = new Date(date);
  return isNaN(d.getTime()) ? undefined : d.getFullYear();
}

/**
 * Converts a timestamp (string, number, or Date) to a number representing milliseconds since epoch.
 * @param ts - The timestamp to convert.
 * @returns The timestamp as a number.
 */
export function getTimestamp(ts: string | number | Date): number {
  if (typeof ts === "number") return ts;
  if (ts instanceof Date) return ts.getTime();
  // Assume string
  return new Date(ts).getTime();
}

/**
 * Formats a number of seconds as mm:ss
 */
export function formatTimeSeconds(seconds?: number): string {
  if (typeof seconds !== "number" || isNaN(seconds)) return "-";
  const m = Math.floor(seconds / 60);
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/**
 * Normalize month values from i18n translation, handling both array and object formats.
 * @param value - The value to normalize, which can be an array or an object with numeric keys.
 * @returns An array of month names as strings, limited to 12 entries.
 */
export function formatMonthValues(value: unknown): string[] {
  if (Array.isArray(value)) return value.slice(0, 12).map(String);
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const numericKeys = Object.keys(obj)
      .filter((k) => /^\d+$/.test(k))
      .sort((a, b) => Number(a) - Number(b));
    if (numericKeys.length > 0)
      return numericKeys.map((k) => String(obj[k])).slice(0, 12);
    return Object.values(obj)
      .map((v) => String(v))
      .slice(0, 12);
  }
  return [];
}

/**
 * Return short month names from i18n `date` namespace.
 * @param t - translation function from `useTranslation('date')`
 */
export function getMonthsShort(t: TFunction): string[] {
  return formatMonthValues(t("months.short", { returnObjects: true }));
}

/**
 * Return long month names from i18n `date` namespace.
 * @param t - translation function from `useTranslation('date')`
 */
export function getMonthsLong(t: TFunction): string[] {
  return formatMonthValues(t("months.long", { returnObjects: true }));
}
