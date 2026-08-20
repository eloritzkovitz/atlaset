import { getYearOffsets } from "@utils";
import type { Country, CountryTimezoneUsage, Timezone } from "../../types";

interface TimezoneMapEntry {
  offsetMinutes: number;
  countryMap: Map<string, CountryTimezoneUsage>;
}

/**
 * Adds or updates a country entry within the aggregated timezone map.
 * @param timezoneMap - The map of timezones to their aggregated data.
 * @param offsetStr - The timezone offset string (e.g., "+02:00").
 * @param min - The offset in minutes.
 * @param country - The country object to add or update.
 * @param isDst - A flag indicating whether the country is in DST.
 */
function addCountryToOffset(
  timezoneMap: Map<string, TimezoneMapEntry>,
  offsetStr: string,
  min: number,
  country: Country,
  isDst: boolean = false,
): void {
  const code = `UTC${offsetStr}`;
  let entry = timezoneMap.get(code);

  // If the entry doesn't exist, create a new one with the given offset and an empty country map
  if (!entry) {
    entry = {
      offsetMinutes: min,
      countryMap: new Map(),
    };
    timezoneMap.set(code, entry);
  }

  const existing = entry.countryMap.get(country.isoCode);

  // If the country already exists in the map, update its DST status if applicable
  if (existing) {
    if (isDst) {
      existing.isDst = true;
    }
  } else {
    entry.countryMap.set(country.isoCode, {
      isoCode: country.isoCode,
      countryName: country.name,
      isDst: isDst,
    });
  }
}

/**
 * Builds a list of timezones from country data, aggregating countries by offset.
 * @param countries - The array of country objects to process.
 * @returns An array of Timezone objects, each containing the offset and associated countries.
 */
export function buildTimezonesFromCountries(countries: Country[]): Timezone[] {
  const timezoneMap = new Map<string, TimezoneMapEntry>();

  for (let i = 0; i < countries.length; i++) {
    const localized = countries[i];
    if (!Array.isArray(localized.timezones)) continue;

    for (let t = 0; t < localized.timezones.length; t++) {
      const tzIdentifier = localized.timezones[t];
      try {
        const { offJan, offJul, janMin, julMin } = getYearOffsets(tzIdentifier);

        // No DST observed for this timezone
        if (offJan === offJul) {
          addCountryToOffset(timezoneMap, offJan, janMin, localized, false);
        } else {
          const isJanStandard = janMin <= julMin;

          const stdOffset = isJanStandard ? offJan : offJul;
          const stdMin = isJanStandard ? janMin : julMin;

          const dstOffset = isJanStandard ? offJul : offJan;
          const dstMin = isJanStandard ? julMin : janMin;

          addCountryToOffset(timezoneMap, stdOffset, stdMin, localized, false);
          addCountryToOffset(timezoneMap, dstOffset, dstMin, localized, true);
        }
      } catch {
        // Ignore invalid IANA identifiers gracefully
      }
    }
  }

  return Array.from(timezoneMap.entries())
    .map(([code, data]) => ({
      code,
      offsetMinutes: data.offsetMinutes,
      countries: Array.from(data.countryMap.values()),
      countriesCount: data.countryMap.size,
    }))
    .sort((a, b) => a.offsetMinutes - b.offsetMinutes);
}
