/**
 * Utility functions for date and time manipulation and formatting.
 */

import i18n from "i18next";
import type { TFunction } from "i18next";

let appDateLocale: string | undefined = undefined;

/** Sets the app-wide date locale for formatting dates. */
export function setAppDateLocale(locale?: string | null) {
  appDateLocale = locale || undefined;
}

/**
 * Formats a date into a localized string based on provided options and locale.
 * @param date - The date to format, which can be a string, number, or Date object.
 * @param options - Optional Intl.DateTimeFormatOptions to customize the output format.
 * @param locale - Optional locale string to specify the language/region for formatting.
 * @returns A formatted date string based on the input and options.
 */
export function formatDate(
  date?: string | number | Date,
  options?: Intl.DateTimeFormatOptions | "long",
  locale?: string,
): string {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date as string);

  // Determine the locale to use for formatting
  const lang =
    locale ||
    appDateLocale ||
    i18n?.language ||
    (typeof navigator !== "undefined" && navigator.language) ||
    "en-GB";

  // Default formatting options for day, month, and year
  const defaults: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  // if options is "long", include time with hours and minutes; otherwise merge with defaults
  const finalOptions: Intl.DateTimeFormatOptions =
    options === "long"
      ? { ...defaults, hour: "2-digit", minute: "2-digit" }
      : { ...defaults, ...(options as Intl.DateTimeFormatOptions | undefined) };

  return new Intl.DateTimeFormat(lang, finalOptions).format(d);
}

/**
 * Converts a Firestore Timestamp or string to a formatted date string.
 * @param date - Firestore Timestamp (with toDate) or string.
 * @param locale - Optional locale for formatting.
 */
export function formatFirestoreDate(
  date: unknown,
  options?: Intl.DateTimeFormatOptions,
): string {
  if (
    date &&
    typeof date === "object" &&
    date !== null &&
    typeof (date as { toDate?: unknown }).toDate === "function"
  ) {
    return formatDate((date as { toDate: () => Date }).toDate(), options);
  } else if (typeof date === "string" && date) {
    return formatDate(date, options);
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
