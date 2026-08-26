/**
 * Utilities for handling explore navigation.
 */

import type { Crumb } from "@components";
import { PANEL_BREADCRUMBS } from "../constants/breadcrumbs";

/**
 * Parses explore paths into normalized panel types and raw route segments.
 * @param pathname - The current URL pathname.
 * @returns An object containing the root, sub, parts, selectedPanel, and menuSelectedPanel.
 */
export function parseExplorePath(pathname: string) {
  const parts = pathname.replace(/^\/explore\/?/, "").split("/");

  const panel = parts[0] || "countries";
  const entity = parts[1];

  let selectedPanel = panel;

  if (panel === "countries" && ["exploration", "all"].includes(entity)) {
    selectedPanel = `${panel}/${entity}`;
  } else if (panel === "currencies" && entity === "exchange") {
    selectedPanel = "currencies/exchange";
  }

  const menuSelectedPanel = selectedPanel.startsWith("countries")
    ? "countries"
    : selectedPanel.startsWith("currencies")
      ? "currencies"
      : selectedPanel;

  return {
    panel,
    entity,
    parts,
    selectedPanel,
    menuSelectedPanel,
  };
}

/**
 * Generates a URL path for the countries display based on the provided region, subregion and ISO code.
 * @param region - The region of the country.
 * @param subregion - The subregion of the country.
 * @param isoCode - The ISO code of the country.
 * @returns A string representing the route to the country details page.
 */
export function getCountriesRoute(
  region?: string,
  subregion?: string,
  isoCode?: string,
): string {
  const r = region ? encodeURIComponent(region.toLowerCase()) : "all";
  const s = subregion ? encodeURIComponent(subregion.toLowerCase()) : "all";

  if (isoCode) return `/explore/countries/${r}/${s}/${isoCode}`;
  if (subregion) return `/explore/countries/${r}/${s}`;
  if (region) return `/explore/countries/${r}`;

  return `/explore/countries/all`;
}

interface ExploreBreadcrumbOptions {
  selectedPanel: string;
  selectedRegion: string | null;
  selectedSubregion: string | null;
  selectedCountry: string | null;
  selectedLanguage: string | null;
  selectedCurrency: string | null;
  selectedTimezone: string | null;
  selectedAchievement: string | null;
}

/**
 * Generates breadcrumbs based on the current navigation state.
 * @param selectedPanel - Currently selected explore panel.
 * @param selectedRegion - Currently selected region.
 * @param selectedSubregion - Currently selected subregion.
 * @param selectedCountry - Currently selected country.
 * @param selectedCurrency - Currently selected currency.
 * @param selectedLanguage - Currently selected language.
 * @param selectedTimezone - Currently selected timezone.
 * @param selectedAchievement - Currently selected achievement.
 * @returns Array of breadcrumb objects.
 */
export function getExploreBreadcrumbs({
  selectedPanel,
  selectedRegion,
  selectedSubregion,
  selectedCountry,
  selectedLanguage,
  selectedCurrency,
  selectedTimezone,
  selectedAchievement,
}: ExploreBreadcrumbOptions): Crumb[] {
  const crumbs = [...(PANEL_BREADCRUMBS[selectedPanel] || [])];

  // Add region and subregion breadcrumbs for the countries panel
  if (selectedPanel === "countries" || selectedPanel.startsWith("countries/")) {
    if (selectedRegion) {
      crumbs.push({
        label: selectedRegion === "all" ? "All Countries" : selectedRegion,
        key: "region",
      });
    }

    if (selectedSubregion && selectedSubregion !== "all") {
      crumbs.push({
        label: selectedSubregion,
        key: "subregion",
      });
    }

    if (selectedCountry) {
      crumbs.push({
        label: selectedCountry,
        key: "country",
      });
    }
  }

  // Add dynamic entity breadcrumbs
  const dynamicEntities = [
    { prefix: "languages", value: selectedLanguage, key: "language" },
    { prefix: "currencies", value: selectedCurrency, key: "currency" },
    { prefix: "timezones", value: selectedTimezone, key: "timezone" },
    { prefix: "achievements", value: selectedAchievement, key: "achievement" },
  ];

  for (const { prefix, value, key } of dynamicEntities) {
    if (
      (selectedPanel === prefix || selectedPanel.startsWith(`${prefix}/`)) &&
      value
    ) {
      crumbs.push({
        label: value,
        key: `${key}:${value}`,
      });
    }
  }

  return crumbs;
}
