/**
 * Utilities for handling dashboard navigation.
 */

import type { Crumb } from "@components";
import { PANEL_BREADCRUMBS } from "../constants/breadcrumbs";

/**
 * Parses dashboard paths into normalized panel types and raw route segments.
 * @param pathname - The current URL pathname.
 * @returns An object containing the root, sub, parts, selectedPanel, and menuSelectedPanel.
 */
export function parseDashboardPath(pathname: string) {
  const parts = pathname.replace(/^\/dashboard\/?/, "").split("/");
  const root = parts[0] || "countries";
  const sub = parts[1];

  let selectedPanel = root;
  if (root === "countries" && ["exploration", "all"].includes(sub)) {
    selectedPanel = `${root}/${sub}`;
  } else if (root === "currencies" && sub === "exchange") {
    selectedPanel = "currencies/exchange";
  }

  const menuSelectedPanel = selectedPanel.startsWith("countries")
    ? "countries"
    : selectedPanel.startsWith("currencies")
      ? "currencies"
      : selectedPanel;

  return { root, sub, parts, selectedPanel, menuSelectedPanel };
}

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
 * Generates breadcrumbs for the dashboard based on the current navigation state.
 * @param selectedPanel - Currently selected dashboard panel.
 * @param selectedRegion - Currently selected region.
 * @param selectedSubregion - Currently selected subregion.
 * @param selectedCountry - Currently selected country.
 * @param selectedCurrency - Currently selected currency.
 * @param selectedAchievement - Currently selected achievement.
 * @returns Array of breadcrumb objects.
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

  // Countries hierarchy
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

  // Dynamic entities (languages, currencies, achievements)
  const dynamicEntities: Array<
    [prefix: string, value: string | null, key: string]
  > = [
    ["languages", selectedLanguage, "language"],
    ["currencies", selectedCurrency, "currency"],
    ["achievements", selectedAchievement, "achievement"],
  ];

  for (const [prefix, value, key] of dynamicEntities) {
    if (
      (selectedPanel === prefix || selectedPanel.startsWith(`${prefix}/`)) &&
      value
    ) {
      crumbs.push({ label: value, key: `${key}:${value}` });
    }
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
 * Returns both the dashboard page title and breadcrumbs based on navigation state.
 */
export function getDashboardMeta({
  selectedPanel,
  selectedRegion,
  selectedSubregion,
  selectedCountry,
  selectedLanguage,
  selectedCurrency,
  selectedAchievement,
}: {
  selectedPanel: string | undefined;
  selectedRegion: string | null | undefined;
  selectedSubregion: string | null | undefined;
  selectedCountry: { name?: string } | null | undefined;
  selectedLanguage: { name?: string } | null | undefined;
  selectedCurrency: { name?: string } | null | undefined;
  selectedAchievement: { name?: string } | null | undefined;
}) {
  return {
    breadcrumbs: getDashboardBreadcrumbs(
      selectedPanel ?? "",
      selectedRegion ?? null,
      selectedSubregion ?? null,
      extractName(selectedCountry),
      extractName(selectedLanguage),
      extractName(selectedCurrency),
      extractName(selectedAchievement),
    ),
  };
}
