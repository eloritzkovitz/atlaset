/**
 * @file Utilities for dashboard navigation
 */
import type { Crumb } from "@components";
import { PANEL_BREADCRUMBS } from "../constants/breadcrumbs";

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
  selectedCountry: { name: string } | null,
  selectedCurrency: { name: string } | null,
  selectedAchievement: { name: string } | null,
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
      crumbs.push({ label: selectedCountry.name, key: "country" });
    }
  }
  if (
    (selectedPanel === "currencies" ||
      selectedPanel.startsWith("currencies/")) &&
    selectedCurrency &&
    selectedCurrency.name
  ) {
    crumbs.push({
      label: selectedCurrency.name,
      key: `currency:${selectedCurrency.name}`,
    });
  }
  if (
    selectedPanel === "achievements" &&
    selectedAchievement &&
    selectedAchievement.name
  ) {
    crumbs.push({
      label: selectedAchievement.name,
      key: `achievement:${selectedAchievement.name}`,
    });
  }
  return crumbs;
}

interface DashboardPageTitleArgs {
  selectedPanel?: string;
  selectedCountry?: { name?: string } | null;
  selectedCurrency?: { name: string } | null;
  selectedAchievement?: { name: string } | null;
  filterName?: string;
  baseTitle?: string;
}

export function getDashboardPageTitle({
  selectedPanel,
  selectedCountry,
  selectedCurrency,
  selectedAchievement,
  filterName = "",
  baseTitle = "",
}: DashboardPageTitleArgs) {
  const safePanel = selectedPanel ?? "";
  const isCountryPanel =
    safePanel.startsWith("countries") ||
    ["countries", "countries/all", "exploration"].includes(safePanel);
  const isCurrencyPanel = safePanel.startsWith("currencies");
  const isAchievementPanel = safePanel.startsWith("achievements");

  const isExploration = safePanel === "exploration";
  if (isExploration) return "World Exploration | Atlaset";
  if (isCountryPanel) {
    if (selectedCountry && selectedCountry.name) {
      return `${selectedCountry.name} | Atlaset`;
    }
    return `${filterName} | Atlaset`;
  }
  if (isCurrencyPanel && selectedCurrency && selectedCurrency.name) {
    return `${selectedCurrency.name} | Atlaset`;
  }
  if (isAchievementPanel && selectedAchievement && selectedAchievement.name) {
    return `${selectedAchievement.name} | Atlaset`;
  }
  return `${baseTitle} | Atlaset`;
}

// Helper to safely extract name from objects that may be null or have missing name
function safeName(
  obj: { name?: string } | null | undefined,
): { name: string } | null {
  return obj && typeof obj.name === "string" && obj.name
    ? { name: obj.name }
    : null;
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
  selectedCurrency,
  selectedAchievement,
}: {
  selectedPanel: string | undefined;
  selectedCountry: { name?: string } | null | undefined;
  routeSelectedRegion: string | null | undefined;
  routeSelectedSubregion: string | null | undefined;
  currentPanel: { title: string } | undefined;
  selectedRegion: string | null | undefined;
  selectedSubregion: string | null | undefined;
  selectedCurrency: { name: string } | null | undefined;
  selectedAchievement: { name: string } | null | undefined;
}) {
  let filterName = "All Countries";
  if (routeSelectedSubregion && routeSelectedSubregion !== "all") {
    filterName = routeSelectedSubregion;
  } else if (routeSelectedRegion && routeSelectedRegion !== "all") {
    filterName = routeSelectedRegion;
  }
  const baseTitle = currentPanel ? currentPanel.title : "Dashboard";
  const safePanel = selectedPanel ?? "";
  const safeRegion = selectedRegion ?? null;
  const safeSubregion = selectedSubregion ?? null;
  const safeCountry = safeName(selectedCountry);
  const safeCurrency = safeName(selectedCurrency);
  const safeAchievement = safeName(selectedAchievement);

  // Determine page title based on panel and selection
  let pageTitle = baseTitle + " | Atlaset";
  const isCountryPanel =
    safePanel.startsWith("countries") ||
    ["countries", "countries/all", "exploration"].includes(safePanel);
  const isCurrencyPanel = safePanel.startsWith("currencies");
  const isAchievementPanel = safePanel.startsWith("achievements");

  switch (true) {
    case safePanel === "exploration":
      pageTitle = "World Exploration | Atlaset";
      break;
    case isCountryPanel && !!safeCountry:
      pageTitle = `${safeCountry.name} | Atlaset`;
      break;
    case isCurrencyPanel && !!safeCurrency:
      pageTitle = `${safeCurrency.name} | Atlaset`;
      break;
    case isAchievementPanel && !!safeAchievement:
      pageTitle = `${safeAchievement.name} | Atlaset`;
      break;
    case isCountryPanel:
      pageTitle = `${filterName} | Atlaset`;
      break;
    default:
      pageTitle = `${baseTitle} | Atlaset`;
  }

  const breadcrumbs = getDashboardBreadcrumbs(
    safePanel,
    safeRegion,
    safeSubregion,
    safeCountry,
    safeCurrency,
    safeAchievement,
  );
  return { pageTitle, breadcrumbs };
}
