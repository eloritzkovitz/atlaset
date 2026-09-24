/**
 * Utility functions for handling country qualifiers.
 */

import type { VisitContext } from "@features/visits/types";
import { timezoneOffsets } from "@utils";
import type { CountryQualifierKey } from "../types";
import { getTranscontinentalInfo } from "../../core/utils/countryData";
import type { Country, TranscontinentalScope } from "../../types";

type QualifierTokenOptions = {
  tcOption?: { scope?: TranscontinentalScope; mode?: string };
  dst?: boolean | string;
  visitContext?: VisitContext;
};

/** Returns tokens for region or subregion qualifiers. */
function getRegionTokens(
  country: Country,
  key: "region" | "subregion",
  tcOption?: { scope?: TranscontinentalScope; mode?: string },
): string[] {
  const tokens: string[] = [];
  const value = country[key];

  if (value) {
    tokens.push(value);
  }

  if (tcOption?.mode !== "include") {
    return tokens;
  }

  const extra = getTranscontinentalInfo(country);

  if (!extra?.scope) {
    return tokens;
  }

  const extraValue =
    key === "region" ? extra.additionalRegion : extra.additionalSubregion;

  if (!extraValue) {
    return tokens;
  }

  const scope = tcOption.scope ?? "all";
  const entryScope = extra.scope.toLowerCase();

  if (scope === "all" || entryScope === scope) {
    tokens.push(extraValue);
  }

  return tokens;
}

/** Returns tokens for the transcontinental qualifier. */
function getTranscontinentalTokens(country: Country): string[] {
  const entry = getTranscontinentalInfo(country);

  if (entry) {
    return ["true", (entry.scope ?? "contiguous").toLowerCase()];
  }

  return ["false"];
}

/** Returns tokens for the language qualifier. */
function getLanguageTokens(country: Country): string[] {
  const languages = Array.isArray(country.languages) ? country.languages : [];
  const codeRegex = /^[a-z]{2,3}(-[A-Za-z0-9-]+)?$/i;
  const displayNames = new Intl.DisplayNames(["en"], { type: "language" });
  const tokens = new Set<string>();

  for (const language of languages) {
    if (!language) continue;

    const value = String(language).trim();
    if (!value) continue;

    if (codeRegex.test(value)) {
      const baseCode = value.split("-")[0].toLowerCase();
      const name = displayNames.of(baseCode);

      tokens.add(baseCode);

      if (name) {
        tokens.add(name);
      }
    } else {
      tokens.add(value);
    }
  }

  return Array.from(tokens).filter(Boolean);
}

/** Returns searchable timezone offset tokens for a country. */
function getTimezoneTokens(country: Country, dst?: boolean | string): string[] {
  const timezones = country.timezones;

  if (!Array.isArray(timezones)) return [];

  const tokens: string[] = [];

  for (const timezone of timezones) {
    if (!timezone) continue;

    try {
      const offsets = timezoneOffsets(timezone as string);
      const winter = offsets[0];
      const summer = offsets.length > 1 ? offsets[1] : undefined;

      const candidates = dst ? (summer ? [summer] : [winter]) : [winter];

      // Process each candidate offset
      for (const o of candidates) {
        const clean = String(o).replace(/\s*\(summer\)$/i, "");
        tokens.push(clean);
        tokens.push(clean.replace(/^UTC/, ""));
        tokens.push(clean.replace(/^UTC/, "").replace(/:/g, ""));
      }
    } catch {
      // Ignore timezone formatting errors.
    }
  }

  return Array.from(new Set(tokens)).filter(Boolean);
}

/** Returns tokens for the sovereign qualifier. */
function getSovereignTokens(country: Country): string[] {
  const tokens = [country.sovereigntyStatus === "sovereign" ? "true" : "false"];

  if (country.sovereignState) {
    tokens.push(String(country.sovereignState).toUpperCase());
  }

  return tokens;
}

/** Returns tokens for the visited or wantToVisit qualifiers. */
function getTrackingTokens(country: Country, isoCodes?: string[]): string[] {
  return isoCodes
    ? [isoCodes.includes(country.isoCode) ? "true" : "false"]
    : [];
}

/**
 * Returns searchable tokens for a specific country qualifier. *
 * @param country - The country to extract tokens from.
 * @param key - The qualifier key to extract.
 * @param options - Additional options for token extraction.
 * @returns An array of strings representing the tokens for the specified qualifier of the country.
 * @see CountryQualifierKey for supported keys and special handling.
 */
export function getQualifierTokens(
  country: Country,
  key: CountryQualifierKey,
  options?: QualifierTokenOptions,
): string[] {
  const { tcOption, dst, visitContext } = options ?? {};

  if (key === "region" || key === "subregion") {
    return getRegionTokens(country, key, tcOption);
  }

  if (key === "tc") {
    return getTranscontinentalTokens(country);
  }

  if (key === "languages") {
    return getLanguageTokens(country);
  }

  if (key === "timezones") {
    return getTimezoneTokens(country, dst);
  }

  if (key === "sovereign") {
    return getSovereignTokens(country);
  }

  if (key === "visited") {
    return getTrackingTokens(country, visitContext?.visitedIsoCodes);
  }

  if (key === "wantToVisit") {
    return getTrackingTokens(country, visitContext?.wantToVisitIsoCodes);
  }

  const value = country[key];

  if (Array.isArray(value)) {
    return value.filter(Boolean).map(String);
  }

  if (typeof value === "string") {
    return [value];
  }

  if (typeof value === "boolean") {
    return [value ? "true" : "false"];
  }

  return [];
}
