/**
 * Utility functions for handling transcontinental country filtering options.
 */

import { getTranscontinentalInfo } from "../../core/utils/countryData";
import type {
  Country,
  TranscontinentalMode,
  TranscontinentalScope,
} from "../../types";

/**
 * Returns true if the given country matches the requested transcontinental option.
 * @param country - The country to check for transcontinental status.
 * @param scope - The transcontinental scope to match against.
 * @returns True if the country matches the transcontinental criteria, false otherwise.
 * @see TranscontinentalScope for the expected scope values and their meanings.
 */
export function matchesTranscontinental(
  country: Country,
  scope?: TranscontinentalScope,
): boolean {
  if (!scope) {
    return false;
  }

  const entry = getTranscontinentalInfo(country);

  if (!entry?.scope) {
    return false;
  }

  const entryScope = entry.scope.toLowerCase();

  if (scope === "all") {
    return true;
  }

  return entryScope === scope.toLowerCase();
}

/**
 * Parses the scope and mode of transcontinental country filtering.
 * @param raw - The raw input value for the transcontinental qualifier.
 * @returns An object containing the parsed scope and optional mode.
 * @see TranscontinentalScope for the expected scope values and their meanings.
 * @see TranscontinentalMode for the expected mode values and their meanings.
 */
export function parseTCOption(raw?: string): {
  scope: TranscontinentalScope;
  mode: TranscontinentalMode;
} {
  let scope: TranscontinentalScope = "all";
  let mode: TranscontinentalMode = "only";

  if (typeof raw !== "string") {
    return { scope, mode };
  }

  const parts = raw
    .toLowerCase()
    .trim()
    .split(":")
    .map((part) => part.trim())
    .filter(Boolean);

  for (const part of parts) {
    if (
      part === "all" ||
      part === "contiguous" ||
      part === "overseas" ||
      part === "cultural" ||
      part === "other"
    ) {
      scope = part;
      continue;
    }

    if (part === "include" || part === "exclude" || part === "only") {
      mode = part;
    }
  }

  return {
    scope,
    mode,
  };
}
