/**
 * Utility functions for interacting with the backend API.
 */

import { getIdToken } from "firebase/auth";
import { resolveBackendUrl } from "./env";
import { auth } from "../firebase/config";

/**
 * Resolves the configured backend URL.
 * @throws If the backend URL is not configured.
 */
export function getBackendUrl(): string {
  const backendUrl = resolveBackendUrl({
    envVar: "VITE_API_URL",
  });

  if (!backendUrl) {
    throw new Error("Backend URL is not configured");
  }

  return backendUrl;
}

/**
 * Sends an authenticated request to the backend API.
 */
export async function backendFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Authentication required");
  }

  const idToken = await getIdToken(user);

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${idToken}`);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`${getBackendUrl()}/api${path}`, {
    ...options,
    headers,
  });
}

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
