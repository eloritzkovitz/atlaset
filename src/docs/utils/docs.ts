import { DOCS } from "../constants/docsMenu";

/**
 * Gets a documentation entry by its slug.
 * @param slug - The slug to search for.
 * @returns The documentation entry matching the slug, or the first entry if not found.
 */
export function getDocBySlug(slug: string | undefined) {
  if (!slug) return undefined;
  return (
    DOCS.find((doc) => {
      const fileNoExt = doc.file.replace(/\.md$/, "");
      if (fileNoExt === slug) return true;
      const parts = fileNoExt.split("/");
      return parts[parts.length - 1] === slug;
    }) || undefined
  );
}

/**
 * Extracts the documentation slug from a pathname.
 * @param pathname - The URL pathname to extract the slug from.
 * @return The extracted slug, or undefined if not found or if the path is not under /docs/.
 */
export function getSlugFromPath(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return undefined;
  if (parts[0] !== "docs") return undefined;
  return parts.length > 1 ? parts[parts.length - 1] : undefined;
}
