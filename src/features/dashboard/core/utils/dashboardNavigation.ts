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
  selectedTimezone: string | null,
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
    ["timezones", selectedTimezone, "timezone"],
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

type ExtractableName =
  | { name?: string; code?: string }
  | string
  | null
  | undefined;

/**
 * Extracts a name or code from an object or string for breadcrumb labeling.
 * @param obj - The object or string to extract the name from.
 * @returns The extracted name or code, or null if not available.
 */
function extractName(obj: ExtractableName): string | null {
  if (typeof obj === "string") return obj;
  if (!obj) return null;
  return obj.name || obj.code || null;
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
  selectedTimezone,
  selectedAchievement,
}: {
  selectedPanel: string | undefined;
  selectedRegion: string | null | undefined;
  selectedSubregion: string | null | undefined;
  selectedCountry: { name?: string } | null | undefined;
  selectedLanguage: { name?: string } | null | undefined;
  selectedCurrency: { name?: string } | null | undefined;
  selectedTimezone:
    | { name?: string; code?: string }
    | string
    | null
    | undefined;
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
      extractName(selectedTimezone),
      extractName(selectedAchievement),
    ),
  };
}
