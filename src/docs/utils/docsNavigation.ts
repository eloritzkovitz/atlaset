/**
 * Utility functions for generating breadcrumbs and navigation for documentation pages.
 */

import type { Crumb } from "@components";
import { DOCS_GROUPS, DOCS_PATH } from "../constants/docsMenu";

/**
 * Navigates to the documentation home.
 * @param navigate - The navigation function.
 */
export function navigateToDocs(navigate: (path: string) => void): void {
  navigate(DOCS_PATH);
}

/**
 * Navigates to a documentation group.
 * @param navigate - The navigation function.
 * @param key - Documentation group key.
 */
export function navigateToDocsGroup(
  navigate: (path: string) => void,
  key: string,
): void {
  if (!(key in DOCS_GROUPS)) {
    return;
  }

  const group = DOCS_GROUPS[key as keyof typeof DOCS_GROUPS];
  const firstItem = group.items[0];

  if (firstItem) {
    navigateToDoc(navigate, firstItem.file);
  }
}

/**
 * Navigates to a documentation page by its file name.
 * @param navigate - The navigation function.
 * @param file - Documentation file name.
 */
export function navigateToDoc(
  navigate: (path: string) => void,
  file: string,
): void {
  if (!file) return;

  const slug = file.replace(/\.md$/, "");
  navigate(`${DOCS_PATH}${slug}`);
}

/**
 * Gets the documentation group containing a file.
 * @param file - Documentation file path.
 * @returns The group key, or null if not found.
 */
function getDocsGroupKey(file: string): keyof typeof DOCS_GROUPS | null {
  for (const [key, group] of Object.entries(DOCS_GROUPS)) {
    if (group.items.some((item) => item.file === file)) {
      return key as keyof typeof DOCS_GROUPS;
    }
  }

  return null;
}

/**
 * Generates breadcrumbs for a documentation page.
 * @param file - Documentation file path.
 * @returns Array of breadcrumb objects.
 */
export function getDocsBreadcrumbs(file: string): Crumb[] {
  const groupKey = getDocsGroupKey(file);

  if (!groupKey) {
    return [];
  }

  const group = DOCS_GROUPS[groupKey];
  const doc = group.items.find((item) => item.file === file);

  if (!doc) {
    return [];
  }

  return [
    {
      label: "Home",
      key: "docs",
    },
    {
      label: group.header.label,
      key: groupKey,
    },
    {
      label: doc.label,
    },
  ];
}
