/**
 * Utility functions for handling country information display and formatting.
 */

import { timezoneOffsets, timezoneRangeLines } from "@utils/timezone";
import type { Currency } from "../types";

/** Gets a formatted string for a currency based on its code.
 * @param code - The ISO code of the currency.
 * @param currencies - An array of currency objects with code and name.
 * @returns A string in the format "Currency Name (CODE)" or just the code if not found.
 */
export function getCurrencyDisplay(
  code: string | undefined,
  currencies: Currency[],
): string {
  if (!code) return "None";
  const currencyObj = currencies.find((c) => c.code === code);
  return currencyObj ? `${currencyObj.name} (${currencyObj.code})` : code;
}

/**
 * Gets a formatted string of languages.
 * @param languages - An array of language names.
 * @returns A comma-separated string of languages or "None" if empty.
 */
export function getLanguagesDisplay(languages?: string[]) {
  if (!languages || languages.length === 0) return "None";
  return languages.join(", ");
}

/**
 * Formats timezones for display. If there are multiple timezones, it will attempt to show a range if possible.
 * @param tzs - An array of timezone identifiers.
 * @returns A formatted string for a single timezone, or an array of two strings if showing a range, or "—" if no timezones.
 */
export function formatTimezones(tzs?: string[]): string | string[] {
  if (!tzs || tzs.length === 0) return "—";
  if (tzs.length === 1) {
    const offs = timezoneOffsets(tzs[0]);
    if (offs.length === 1) return offs[0];
    return [offs[0], offs[1]];
  }

  const lines = timezoneRangeLines(tzs);
  if (lines.length === 1) return lines[0];
  return [lines[0], lines[1]];
}

/**
 * Gets a formatted string of alternative names.
 * @param altNames - An array of alternative names.
 * @returns A comma-separated string of alternative names or "None" if empty.
 */
export function getAltNamesDisplay(altNames?: string[]) {
  if (!altNames || altNames.length === 0) return "None";
  return altNames.join(", ");
}
