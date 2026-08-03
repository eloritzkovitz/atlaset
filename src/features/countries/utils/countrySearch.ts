/**
 * Utility functions for searching and filtering countries based on their properties.
 */

import type { VisitContext } from "@features/visits";
import { suggestByPrefix, timezoneOffsets } from "@utils";
import { getTranscontinentalInfo } from "./countryData";
import {
  COUNTRY_QUALIFIER_MAP,
  SUPPORTED_QUALIFIERS,
} from "../constants/qualifierConfig";
import type {
  Country,
  CountryQualifierConfig,
  CountryQualifierKey,
  TranscontinentalScope,
} from "../types";

/**
 * Resolves a qualifier configuration based on a given qualifier name.
 * This is used to determine how to filter countries based on user input in the format "qualifier:query".
 * @param qualifier - The qualifier name to resolve.
 * @returns The qualifier configuration or undefined if not found.
 */
export function resolveQualifierConfig(
  qualifier: string,
): CountryQualifierConfig | undefined {
  return COUNTRY_QUALIFIER_MAP[qualifier.toLowerCase()];
}

/**
 * Provides qualifier name suggestions based on user input for qualifier-based searching.
 * @input The current user input for the qualifier, used to generate suggestions.
 */
export function qualifierSuggestionProvider(input: string) {
  return suggestByPrefix(SUPPORTED_QUALIFIERS, input);
}

/**
 * Builds a search string for a country by concatenating relevant properties.
 * @param country - The country object to build the search string from.
 * @returns A string that combines the country's name and alternative names for search purposes.
 */
export function buildSearchString(country: Country) {
  return [country.name, ...(country.altNames ?? [])].join(" ");
}

/**
 * Return searchable tokens for a specific country qualifier.
 * @param country - The country to extract tokens from.
 * @param key - The qualifier key to extract.
 * @param options - Additional options for token extraction.
 * @returns An array of strings representing the tokens for the specified qualifier of the country.
 * @see CountryQualifierKey for supported keys and special handling.
 */
export function getQualifierTokens(
  country: Country,
  key: CountryQualifierKey,
  options?: {
    tcOption?: { scope?: TranscontinentalScope; mode?: string };
    dst?: boolean | string;
    visitContext?: VisitContext;
  },
) {
  const { tcOption, visitContext } = options ?? {};
  const dstOption = options?.dst;

  // Determine if transcontinental countries should be included based on the provided options
  const includeTC: TranscontinentalScope | boolean = tcOption
    ? tcOption.mode === "include" || tcOption.scope === "all"
      ? true
      : (tcOption.scope ?? false)
    : false;
  const vIso = visitContext?.visitedIsoCodes;
  const wIso = visitContext?.wantToVisitIsoCodes;

  // Handle special cases for certain qualifiers that require custom token extraction logic
  if (key === "region" || key === "subregion") {
    const tokens: string[] = [];
    const val = country[key];
    if (val) tokens.push(val);
    if (includeTC) {
      const extra = getTranscontinentalInfo(country);
      const extraVal =
        key === "region" ? extra?.additionalRegion : extra?.additionalSubregion;
      if (extraVal) {
        const entryScope = (extra?.scope ?? "contiguous").toLowerCase();
        if (includeTC === true || includeTC === entryScope)
          tokens.push(extraVal);
      }
    }
    return tokens;
  }

  if (key === "tc") {
    const entry = getTranscontinentalInfo(country);
    if (entry) return ["true", (entry.scope ?? "contiguous").toLowerCase()];
    return ["false"];
  }

  if (key === "languages") {
    const langs = Array.isArray(country.languages) ? country.languages : [];
    const codeRe = /^[a-z]{2,3}(-[A-Za-z0-9-]+)?$/i;
    const dn = new Intl.DisplayNames(["en"], { type: "language" });
    const out = new Set<string>();
    for (const l of langs) {
      if (!l) continue;
      const s = String(l).trim();
      if (!s) continue;
      if (codeRe.test(s)) {
        const base = s.split("-")[0].toLowerCase();
        const name = dn.of(base) || base;
        out.add(String(name));
      } else out.add(s);
    }
    return Array.from(out).filter(Boolean).map(String);
  }

  if (key === "timezones") {
    const tzs = country.timezones;
    if (!Array.isArray(tzs)) return [] as string[];
    const toks: string[] = [];
    for (const tz of tzs) {
      if (!tz) continue;
      try {
        const offs = timezoneOffsets(tz as string);
        const winter = offs[0];
        const summer = offs.length > 1 ? offs[1] : undefined;
        const candidates = dstOption
          ? summer
            ? [summer]
            : [winter]
          : [winter];
        for (const o of candidates) {
          const clean = String(o).replace(/\s*\(summer\)$/i, "");
          toks.push(clean);
          toks.push(clean.replace(/^UTC/, ""));
          toks.push(clean.replace(/^UTC/, "").replace(/:/g, ""));
        }
      } catch {
        // ignore timezone formatting errors
      }
    }
    return Array.from(new Set(toks)).filter(Boolean).map(String);
  }

  if (key === "sovereign") {
    const toks: string[] = [];
    toks.push(country.sovereigntyStatus === "sovereign" ? "true" : "false");
    const sstate = country.sovereignState || undefined;
    if (sstate) toks.push(String(sstate).toUpperCase());
    return toks;
  }

  if (key === "visited")
    return vIso ? [vIso.includes(country.isoCode) ? "true" : "false"] : [];

  if (key === "wantToVisit")
    return wIso ? [wIso.includes(country.isoCode) ? "true" : "false"] : [];
  
  const prop = country[key];

  if (Array.isArray(prop)) return prop.filter(Boolean).map(String);
  if (typeof prop === "string") return [prop];
  if (typeof prop === "boolean") return [prop ? "true" : "false"];
  return [] as string[];
}
