/**
 * Utilities for dashboard navigation.
 */

import type { Crumb } from "@components";
import { PANEL_BREADCRUMBS } from "../constants/breadcrumbs";

/**
 * Generates a dashboard URL path for countries, regions, or subregions.
 * @param region - The region of the country.
 * @param subregion - The subregion of the country.
 * @param isoCode - The ISO code of the country.
 * @returns A string representing the route to the country details page.
 */
export function getCountryRoute(
  region?: string,
  subregion?: string,
  isoCode?: string,
): string {
  const r = region ? encodeURIComponent(region.toLowerCase()) : "all";
  const s = subregion ? encodeURIComponent(subregion.toLowerCase()) : "all";

  if (isoCode) return `/dashboard/countries/${r}/${s}/${isoCode}`;
  if (subregion) return `/dashboard/countries/${r}/${s}`;
  if (region) return `/dashboard/countries/${r}`;

  return `/dashboard/countries/all`;
}

/**
 * Generate breadcrumbs for the dashboard based on navigation state
 * @param selectedPanel - Currently selected dashboard panel
 * @param selectedRegion - Currently selected region
 * @param selectedSubregion - Currently selected subregion
 * @param selectedCountry - Currently selected country
 * @param selectedCurrency - Currently selected currency
 * @param selectedAchievement - Currently selected achievement
 * @returns Array of breadcrumb objects
 */
export function getDashboardBreadcrumbs(
  selectedPanel: string,
  selectedRegion: string | null,
  selectedSubregion: string | null,
  selectedCountry: string | null,
  selectedLanguage: string | null,
  selectedCurrency: string | null,
  selectedAchievement: string | null,
): Crumb[] {
  const crumbs = [...(PANEL_BREADCRUMBS[selectedPanel] || [])];

  if (selectedPanel === "countries" || selectedPanel.startsWith("countries/")) {
    if (selectedRegion) {
      crumbs.push({
        label: selectedRegion === "all" ? "All Countries" : selectedRegion,
        key: "region",
      });
    }
    if (selectedSubregion && selectedSubregion !== "all") {
      crumbs.push({ label: selectedSubregion, key: "subregion" });
    }
    if (selectedCountry) {
      crumbs.push({ label: selectedCountry, key: "country" });
    }
  }
  if (
    (selectedPanel === "languages" || selectedPanel.startsWith("languages/")) &&
    selectedLanguage &&
    selectedLanguage
  ) {
    crumbs.push({
      label: selectedLanguage,
      key: `language:${selectedLanguage}`,
    });
  }
  if (
    (selectedPanel === "currencies" ||
      selectedPanel.startsWith("currencies/")) &&
    selectedCurrency &&
    selectedCurrency
  ) {
    crumbs.push({
      label: selectedCurrency,
      key: `currency:${selectedCurrency}`,
    });
  }
  if (
    selectedPanel === "achievements" &&
    selectedAchievement &&
    selectedAchievement
  ) {
    crumbs.push({
      label: selectedAchievement,
      key: `achievement:${selectedAchievement}`,
    });
  }
  return crumbs;
}

/** Safely extracts a string name from an object, returning null if the object is null or has no valid name.
 * @param obj - The object from which to extract the name.
 * @returns The name string if present, otherwise null.
 */
function extractName(obj: { name?: string } | null | undefined): string | null {
  return obj && typeof obj.name === "string" && obj.name ? obj.name : null;
}

/**
 * Returns both the dashboard page title and breadcrumbs based on navigation state
 */
export function getDashboardMeta({
  selectedPanel,
  selectedCountry,
  selectedRegion,
  selectedSubregion,
  selectedLanguage,
  selectedCurrency,
  selectedAchievement,
}: {
  selectedPanel: string | undefined;
  selectedRegion: string | null | undefined;
  selectedSubregion: string | null | undefined;
  selectedCountry: { name?: string } | null | undefined;
  selectedLanguage: { name: string } | null | undefined;
  selectedCurrency: { name: string } | null | undefined;
  selectedAchievement: { name: string } | null | undefined;
}) {
  const safePanel = selectedPanel ?? "";
  const safeRegion = selectedRegion ?? null;
  const safeSubregion = selectedSubregion ?? null;
  const countryName = extractName(selectedCountry);
  const languageName = extractName(selectedLanguage);
  const currencyName = extractName(selectedCurrency);
  const achievementName = extractName(selectedAchievement);

  const breadcrumbs = getDashboardBreadcrumbs(
    safePanel,
    safeRegion,
    safeSubregion,
    countryName,
    languageName,
    currencyName,
    achievementName,
  );

  return { breadcrumbs };
}
