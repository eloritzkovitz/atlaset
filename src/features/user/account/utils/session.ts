/**
 * Utility functions for device information and session management.
 */

import {
  getCachedValue,
  removeCachedValue,
  setCachedValue,
} from "@utils/browser/storage";
import type { UserSession } from "../types";
import { isLocalhost } from "@utils/browser/env";

const SESSION_KEY = "atlaset:sessionId";

/**
 * Gathers session information from the browser.
 * @returns An object containing session information.
 */
export function getBrowserSessionInfo() {
  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "[::1]");

  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    screen: `${window.screen.width}x${window.screen.height}`,
    isLocalhost,
  };
}

/**
 * Gets or creates a unique session ID for the current browser session.
 * @returns The session ID.
 */
export function getOrCreateSessionId(): string {
  let sessionId = getCachedValue<string | null>(SESSION_KEY, null);

  if (!sessionId) {
    sessionId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2);

    setCachedValue(SESSION_KEY, sessionId);
  }

  return sessionId;
}

/**
 * Checks if the given session ID matches the current session.
 * @param sessionId - The session ID to check.
 * @returns True if it matches the current session.
 */
export function isCurrentSession(sessionId?: string): boolean {
  return Boolean(sessionId && sessionId === getOrCreateSessionId());
}

/**
 * Determines if the given session is a development session based on its IP address or location.
 * @param session - The user session to check.
 * @returns True if it is a development session, false otherwise.
 */
export function isDevSession(session: UserSession): boolean {
  const { ipAddress = "", location = "" } = session;

  return isLocalhost(location) || isLocalhost(ipAddress);
}

/**
 * Destroys the local browser session cache token.
 */
export function clearLocalSession(): void {
  removeCachedValue(SESSION_KEY);
}
