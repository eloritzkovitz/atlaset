import type { TFunction } from "i18next";
import { canonicalKey } from "@utils/string";

/** Translate a region label when the region appears in the map; otherwise return raw. */
export function translateRegionLabel(
  region: string,
  tCountries: TFunction,
  tDashboard: TFunction,
  subregionsByRegion: Record<string, string[]>,
) {
  if (!region) return region;
  if (region === "All Countries") return tDashboard("menu.allCountries");
  return subregionsByRegion[region]
    ? tCountries(`regions.${canonicalKey(region)}`)
    : region;
}

/** Translate a subregion label using the reverse map or a selectedRegion fallback. */
export function translateSubregionLabel(
  subregion: string,
  subregionToRegion: Map<string, string>,
  selectedRegion: string | undefined,
  tCountries: TFunction,
) {
  if (!subregion) return subregion;
  const regionKey = subregionToRegion.get(subregion) ?? selectedRegion;
  if (!regionKey) return subregion;
  return tCountries(
    `subregions.${canonicalKey(regionKey)}.${canonicalKey(subregion)}`,
  );
}
