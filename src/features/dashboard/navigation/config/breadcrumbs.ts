import type { Crumb } from "@components";

// Predefined breadcrumbs for dashboard panels
const PANEL_BREADCRUMBS: Record<string, Crumb[]> = {
  countries: [
    { label: "Dashboard", key: "dashboard" },
    { label: "Countries", key: "countries" },
  ],
  "countries/all": [
    { label: "Dashboard", key: "dashboard" },
    { label: "Countries", key: "countries/all" },
    { label: "All Countries" },
  ],
  "countries/overview": [
    { label: "Dashboard", key: "dashboard" },
    { label: "Countries", key: "countries/overview" },
    { label: "Overview" },
  ],
  "trips/overview": [
    { label: "Dashboard", key: "dashboard" },
    { label: "Trips", key: "trips/overview" },
    { label: "Overview" },
  ],
  "trips/history": [
    { label: "Dashboard", key: "dashboard" },
    { label: "Trips", key: "trips/overview" },
    { label: "History" },
  ],
  "trips/month": [
    { label: "Dashboard", key: "dashboard" },
    { label: "Trips", key: "trips/overview" },
    { label: "By Month" },
  ],
  "trips/year": [
    { label: "Dashboard", key: "dashboard" },
    { label: "Trips", key: "trips/overview" },
    { label: "By Year" },
  ],
};

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
  selectedCountry: { name: string } | null
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
    if (selectedSubregion) {
      crumbs.push({ label: selectedSubregion, key: "subregion" });
    }
    if (selectedCountry) {
      crumbs.push({ label: selectedCountry.name, key: "country" });
    }
  }

  return crumbs;
}
