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
  const parts = pathname
    .replace(/^\/dashboard\/?/, "")
    .split("/")
    .filter(Boolean);

  const panel = parts[0] || "overview";
  const entityId = parts[1] ?? null;

  return {
    selectedPanel: entityId ? `${panel}/${entityId}` : panel,
    menuSelectedPanel: panel,
    entityId,
  };
}

interface DashboardBreadcrumbOptions {
  selectedPanel: string;
  selectedAchievement?: string | null;
}

/**
 * Generates breadcrumbs for the dashboard based on the current navigation state.
 * @param selectedPanel - Currently selected dashboard panel.
 * @param selectedAchievement - Currently selected achievement.
 * @returns Array of breadcrumb objects.
 */
export function getDashboardBreadcrumbs({
  selectedPanel,
  selectedAchievement,
}: DashboardBreadcrumbOptions): Crumb[] {
  const crumbs = [...(PANEL_BREADCRUMBS[selectedPanel] ?? [])];

  if (
    (selectedPanel === "achievements" ||
      selectedPanel.startsWith("achievements/")) &&
    selectedAchievement
  ) {
    crumbs.push({
      label: selectedAchievement,
      key: `achievement:${selectedAchievement}`,
    });
  }

  return crumbs;
}
