/**
 * Utility functions related to environment checks and global objects.
 */

import { resolveBackendUrl } from "./env";

/**
 * Returns default fetch options based on environment.
 * In development, it disables caching to ensure fresh data during development.
 * In production, it returns undefined to allow default browser caching behavior.
 * @returns Fetch options object or undefined.
 */
export function defaultFetchOpts(): RequestInit | undefined {
  return process.env.NODE_ENV === "development"
    ? { cache: "no-store" as RequestCache }
    : undefined;
}

/**
 * Fetches JSON data from a static URL with an optional backend fallback.
 * @param staticUrl - The URL of the static JSON file to fetch first.
 * @param backendUrl - Optional URL of the backend endpoint to fetch from if static fetch fails.
 * @param label - Optional label for error messages to clarify what failed to load.
 * @param fetchOpts - Optional fetch options.
 * @returns A promise resolving to the fetched JSON data or rejecting with an error.
 */
export async function fetchWithFallback(
  staticUrl: string,
  backend?: string | { envVar: string },
  label?: string,
  fetchOpts?: RequestInit,
) {
  // Determine backend URL from string or environment variable
  const opts = fetchOpts ?? defaultFetchOpts();
  const backendUrl = resolveBackendUrl(backend);

  // Attempt fetching from a URL and return JSON or undefined on failure
  const tryFetch = async (url?: string) => {
    if (!url) return undefined;
    try {
      const res = await fetch(url, opts);
      if (!res || !res.ok) return undefined;
      return await res.json();
    } catch {
      return undefined;
    }
  };

  // First try static URL, then backend if static fails
  const staticResult = await tryFetch(staticUrl);
  if (staticResult !== undefined) return staticResult;

  if (backendUrl) {
    const backendResult = await tryFetch(backendUrl);
    if (backendResult !== undefined) return backendResult;
    throw new Error(`Failed to load ${label || "data"} from backend`);
  }

  throw new Error(`Failed to load ${label || "data"}`);
}
