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
