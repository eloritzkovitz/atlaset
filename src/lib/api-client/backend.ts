/**
 * Utility functions for interacting with the backend API.
 */

import { resolveBackendUrl } from "./env";

/**
 * Warms up the backend by sending a ping request to the API.
 */
export function warmUpBackend(): void {
  const backendUrl = resolveBackendUrl({
    envVar: "VITE_API_URL",
  });

  if (!backendUrl) return;

  void fetch(`${backendUrl}/api/ping`).catch(() => {});
}
