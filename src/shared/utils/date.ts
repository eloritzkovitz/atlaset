/**
 * Utility functions for date manipulation and formatting.
 */

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
 * Returns the month name for a given month index (0 = Jan, 11 = Dec).
 * If no index is provided, returns all month names as an array.
 */
export function getMonthName(monthIdx?: number): string | string[] {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  if (typeof monthIdx === "number") return months[monthIdx];
  return months;
}
