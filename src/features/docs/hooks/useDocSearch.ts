import { DOCS_GROUPS } from "../constants/docsMenu";

/**
 * Search documentation items based on a search string.
 * @param search - The search string to filter documentation items.
 * @returns An object containing all documentation items and the filtered search results.
 */
export function useDocSearch(search: string) {
  // Flatten all docs from all groups
  const allDocs = Object.values(DOCS_GROUPS)
    .flatMap((group) => group.items)
    .filter((doc) => doc.file && doc.label);
  const searchResults =
    search.trim().length > 0
      ? allDocs.filter((doc) =>
          doc.label.toLowerCase().includes(search.toLowerCase()),
        )
      : [];
  return { allDocs, searchResults };
}
