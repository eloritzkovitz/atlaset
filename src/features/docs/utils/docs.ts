import { DOCS } from "../constants/docsMenu";

/**
 * Gets a documentation entry by its slug.
 * @param slug - The slug to search for.
 * @returns The documentation entry matching the slug, or the first entry if not found.
 */
export function getDocBySlug(slug: string | undefined) {
  if (!slug) return DOCS[0];
  return DOCS.find((doc) => doc.file.replace(/\.md$/, "") === slug) || DOCS[0];
}

/**
 * Navigates to a documentation page by its file name.
 * @param navigate - The navigation function.
 * @param file - The documentation file name.
 */
export function navigateToDoc(navigate: (path: string) => void, file: string) {
  if (!file) return;
  const slug = file.replace(/\.md$/, "");
  navigate(`/docs/${slug}`);
}
