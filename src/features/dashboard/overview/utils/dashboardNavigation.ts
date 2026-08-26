/**
 * Utilities for handling dashboard navigation.
 */

import type { Crumb } from "@components";
import { DASHBOARD_BREADCRUMBS } from "../constants/dashboard";

/**
 * Parses dashboard paths into normalized sections and entity IDs.
 * @param pathname - The current URL pathname.
 * @returns An object containing the section and entityId.
 */
export function parseDashboardPath(pathname: string) {
  const parts = pathname
    .replace(/^\/dashboard\/?/, "")
    .split("/")
    .filter(Boolean);

  const section = parts[0] || "overview";
  const entityId = parts[1] ?? null;

  return {
    section,
    entityId,
  };
}

/**
 * Generates breadcrumbs for the dashboard based on the current navigation state.
 * @param selectedPanel - Currently selected dashboard panel.
 * @returns Array of breadcrumb objects.
 */
export function getDashboardBreadcrumbs({
  section,
}: {
  section: string;
}): Crumb[] {
  const crumbs = [...(DASHBOARD_BREADCRUMBS[section] ?? [])];

  return crumbs;
}
