/**
 * @file Utilities for dashboard navigation
 */

import type { Crumb } from "@components";
import { PANEL_BREADCRUMBS } from "../config/breadcrumbs";

/**
 * Generate breadcrumbs for the dashboard based on navigation state
 * @param selectedPanel - Currently selected dashboard panel
 * @param selectedRegion - Currently selected region
 * @param selectedSubregion - Currently selected subregion
 * @param selectedCountry - Currently selected country
 * @returns Array of breadcrumb objects
 */
export function getDashboardBreadcrumbs(
  selectedPanel: string,
  selectedRegion: string | null,
  selectedSubregion: string | null,
  selectedCountry: { name: string } | null,
): Crumb[] {
  const crumbs = [...(PANEL_BREADCRUMBS[selectedPanel] || [])];

  // Only add dynamic crumbs for countries panel
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
      crumbs.push({ label: selectedCountry.name, key: "country" });
    }
  }

  return crumbs;
}

interface DashboardPageTitleArgs {
  selectedPanel?: string;
  selectedCountry?: { name?: string } | null;
  filterName?: string;
  baseTitle?: string;
}

export function getDashboardPageTitle({
  selectedPanel,
  selectedCountry,
  filterName = "",
  baseTitle = "",
}: DashboardPageTitleArgs) {
  // Consider all country-related panels for dynamic title
  const safePanel = selectedPanel ?? "";
  const isCountryPanel =
    safePanel.startsWith("countries") ||
    ["countries", "countries/all", "countries/exploration"].includes(safePanel);

  // Special case: /countries/exploration route
  const isExploration = safePanel === "countries/exploration";
  if (isExploration) return "World Exploration | Atlaset";
  if (isCountryPanel) {
    if (selectedCountry && selectedCountry.name) {
      return `${selectedCountry.name} | Atlaset`;
    }
    return `${filterName} | Atlaset`;
  }
  return `${baseTitle} | Atlaset`;
}

/**
 * Returns both the dashboard page title and breadcrumbs based on navigation state
 */
export function getDashboardMeta({
  selectedPanel,
  selectedCountry,
  routeSelectedRegion,
  routeSelectedSubregion,
  currentPanel,
  selectedRegion,
  selectedSubregion,
}: {
  selectedPanel: string | undefined;
  selectedCountry: { name?: string } | null | undefined;
  routeSelectedRegion: string | null | undefined;
  routeSelectedSubregion: string | null | undefined;
  currentPanel: { title: string } | undefined;
  selectedRegion: string | null | undefined;
  selectedSubregion: string | null | undefined;
}) {
  let filterName = "All Countries";
  if (routeSelectedSubregion && routeSelectedSubregion !== "all") {
    filterName = routeSelectedSubregion;
  } else if (routeSelectedRegion && routeSelectedRegion !== "all") {
    filterName = routeSelectedRegion;
  }
  const baseTitle = currentPanel ? currentPanel.title : "Dashboard";
  const safePanel = selectedPanel ?? "";
  const pageTitle = getDashboardPageTitle({
    selectedPanel: safePanel,
    selectedCountry,
    filterName,
    baseTitle,
  });
  const safeRegion = selectedRegion ?? null;
  const safeSubregion = selectedSubregion ?? null;
  let safeCountry: { name: string } | null = null;
  if (
    selectedCountry &&
    typeof selectedCountry.name === "string" &&
    selectedCountry.name
  ) {
    safeCountry = { name: selectedCountry.name };
  }
  const breadcrumbs = getDashboardBreadcrumbs(
    safePanel,
    safeRegion,
    safeSubregion,
    safeCountry,
  );
  return { pageTitle, breadcrumbs };
}
