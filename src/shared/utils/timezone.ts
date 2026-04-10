/**
 * Utility functions for handling timezones.
 */

import { format } from "date-fns-tz";

/**
 * Normalizes a timezone offset string, converting "Z" to "+00:00".
 * @param offset - The timezone offset string to normalize.
 * @returns The normalized timezone offset string.
 */
function normalizeOffset(offset: string) {
  return offset === "Z" ? "+00:00" : offset;
}

/**
 * Converts a timezone offset string like "+02:00" or "Z" to total minutes.
 * @param offset - The timezone offset string to convert.
 * @returns The total offset in minutes.
 */
function offsetToMinutes(offset: string) {
  const sign = offset.startsWith("-") ? -1 : 1;
  const parts = offset.slice(1).split(":");
  const hours = parseInt(parts[0] || "0", 10);
  const minutes = parseInt(parts[1] || "0", 10);
  return sign * (hours * 60 + minutes);
}

/**
 * Converts a total offset in minutes to a string in the format of "+HH:MM" or "-HH:MM".
 * @param m - The total offset in minutes to convert.
 * @returns = A string representing the timezone offset in "+HH:MM" or "-HH:MM" format.
 */
function minutesToOffset(m: number) {
  const sign = m < 0 ? "-" : "+";
  const abs = Math.abs(m);
  const h = Math.floor(abs / 60)
    .toString()
    .padStart(2, "0");
  const mm = (abs % 60).toString().padStart(2, "0");
  return `${sign}${h}:${mm}`;
}

/**
 * Gets the January and July offsets for a given timezone, which can be used to determine if the timezone observes DST and what the offsets are.
 * @param tz - The timezone identifier to get offsets for.
 * @returns An object containing the January and July offsets as strings, as well as their corresponding minute values for easier comparison.
 */
function getYearOffsets(tz: string) {
  const year = new Date().getUTCFullYear();
  const jan = new Date(Date.UTC(year, 0, 1));
  const jul = new Date(Date.UTC(year, 6, 1));
  const offJan = normalizeOffset(format(jan, "XXX", { timeZone: tz }));
  const offJul = normalizeOffset(format(jul, "XXX", { timeZone: tz }));
  return {
    offJan,
    offJul,
    janMin: offsetToMinutes(offJan),
    julMin: offsetToMinutes(offJul),
  };
}

/**
 * Return an array of offsets for a timezone. If the zone has no DST, returns a single entry like `UTC+01:00`.
 * If it has two offsets, returns both of them with winter first.
 */
export function timezoneOffsets(tz: string): string[] {
  const { offJan, offJul, janMin, julMin } = getYearOffsets(tz);
  if (offJan === offJul) return [`UTC${offJan}`];
  const winter = janMin <= julMin ? offJan : offJul;
  const summer = janMin <= julMin ? offJul : offJan;
  return [`UTC${winter}`, `UTC${summer} (summer)`];
}

/**
 * Given a list of timezones, returns a single line string representing the range of offsets.
 * @param tzList - An array of timezone identifiers.
 * @returns A string representing the range of UTC offsets for the given timezones.
 */
export function timezoneRangeForZones(tzList: string[]): string {
  const mins: number[] = [];
  for (const tz of tzList) {
    const { janMin, julMin } = getYearOffsets(tz);
    mins.push(janMin, julMin);
  }
  const uniqueMins = Array.from(new Set(mins)).sort((a, b) => a - b);
  if (uniqueMins.length === 0) return "—";
  const min = uniqueMins[0];
  const max = uniqueMins[uniqueMins.length - 1];
  if (min === max) return `UTC${minutesToOffset(min)}`;
  return `UTC${minutesToOffset(min)} to UTC${minutesToOffset(max)}`;
}

/**
 * Return one or two lines for a timezone range. First line is the winter range,
 * second line (optional) is the summer range with a `(summer)` suffix if it differs.
 */
export function timezoneRangeLines(tzList: string[]): string[] {
  const winters: number[] = [];
  const summers: number[] = [];
  for (const tz of tzList) {
    const { janMin, julMin } = getYearOffsets(tz);
    const isJanWinter = janMin <= julMin;
    winters.push(isJanWinter ? janMin : julMin);
    summers.push(isJanWinter ? julMin : janMin);
  }
  if (winters.length === 0) return ["—"];
  const unique = (arr: number[]) =>
    Array.from(new Set(arr)).sort((a, b) => a - b);
  const w = unique(winters);
  const s = unique(summers);
  const minW = w[0];
  const maxW = w[w.length - 1];
  const minS = s[0];
  const maxS = s[s.length - 1];
  const winterLine =
    minW === maxW
      ? `UTC${minutesToOffset(minW)}`
      : `UTC${minutesToOffset(minW)} to UTC${minutesToOffset(maxW)}`;
  const summerLine =
    minS === maxS
      ? `UTC${minutesToOffset(minS)}`
      : `UTC${minutesToOffset(minS)} to UTC${minutesToOffset(maxS)}`;
  if (winterLine === summerLine) return [winterLine];
  return [winterLine, `${summerLine} (summer)`];
}
