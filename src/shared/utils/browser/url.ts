/**
 * Utility functions for handling URLs and determining link types.
 */

/**
 * Determines whether a given URL string should navigate outside the local client-side SPA bundle tree.
 * @param url - The URL string to check.
 * @returns True if the URL is external (starts with "http://", "https://", "mailto:", or "tel:"), false otherwise.
 */
export function isExternalUrl(url?: string): boolean {
  if (!url) return false;

  return /^(https?:)?\/\/|mailto:|tel:/.test(url);
}

/**
 * Extracts the trailing path segment or domain name from a URL for display purposes.
 * @param url - The URL string to parse.
 * @returns The last path segment, domain hostname, or original URL if invalid/empty.
 */
export function getUrlDisplayPath(url?: string): string | undefined {
  const cleaned = url?.trim();
  if (!cleaned) return "";

  try {
    const parsed = new URL(
      cleaned.startsWith("http") ? cleaned : `https://${cleaned}`,
    );
    const segments = parsed.pathname.split("/").filter(Boolean);

    if (segments.length > 0) {
      return segments[segments.length - 1];
    }
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/**
 * Extracts a query parameter from the browser URL location.
 * @param key - The query string key name to find.
 * @param fallback - The string value to return if the key cannot be found or parsed.
 * @param customSearchString - An optional search string to parse instead of window.location.
 * @returns The value of the query parameter if found, otherwise the fallback string.
 */
export function getQueryParam(
  key: string,
  fallback: string = "",
  customSearchString?: string,
): string {
  try {
    const search =
      customSearchString ??
      (typeof window !== "undefined" ? window.location?.search : undefined);

    // If no search string is available, return fallback
    if (!search) return fallback;

    const params = new URLSearchParams(search);
    return params.get(key) ?? fallback;
  } catch (error) {
    console.error(`Failed to parse URL query parameter for key: ${key}`, error);
    return fallback;
  }
}

/**
 * Generates a localized Wikipedia URL for any query term.
 * @param query - The entity or topic name.
 * @param lang - Optional BCP 47 language tag.
 * @returns The direct Wikipedia article URL in the target language.
 */
export function getWikipediaUrl(query: string, lang: string = "en"): string {
  if (!query) return "";

  const langSubtag = lang.split("-")[0];
  const page = query.trim().replace(/ /g, "_");

  return `https://${langSubtag}.wikipedia.org/wiki/${encodeURIComponent(page)}`;
}
