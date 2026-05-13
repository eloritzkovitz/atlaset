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
  selectedLanguage: { name: string } | null,
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
    (selectedPanel === "languages" ||
      selectedPanel.startsWith("languages/")) &&
    selectedLanguage &&
    selectedLanguage.name
  ) {
    crumbs.push({
      label: selectedLanguage.name,
      key: `language:${selectedLanguage.name}`,
    });
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
  selectedRegion,
  selectedSubregion,
  selectedLanguage,
  selectedCurrency,
  selectedAchievement,
}: {
  selectedPanel: string | undefined;
  selectedCountry: { name?: string } | null | undefined;  
  currentPanel: { title: string } | undefined;
  selectedRegion: string | null | undefined;
  selectedSubregion: string | null | undefined;
  selectedLanguage: { name: string } | null | undefined;
  selectedCurrency: { name: string } | null | undefined;
  selectedAchievement: { name: string } | null | undefined;
}) {
  const safePanel = selectedPanel ?? "";
  const safeRegion = selectedRegion ?? null;
  const safeSubregion = selectedSubregion ?? null;
  const safeCountry = safeName(selectedCountry);
  const safeLanguage = safeName(selectedLanguage);
  const safeCurrency = safeName(selectedCurrency);
  const safeAchievement = safeName(selectedAchievement);

  const breadcrumbs = getDashboardBreadcrumbs(
    safePanel,
    safeRegion,
    safeSubregion,    
    safeCountry,
    safeLanguage,
    safeCurrency,
    safeAchievement,
  );
  return { breadcrumbs };
}
