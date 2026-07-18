/**
 * Utility functions for device information and session management.
 */

const SESSION_KEY = "atlaset:sessionId";

/**
 * Gathers session information from the browser.
 * @returns An object containing session information.
 */
export function getBrowserSessionInfo() {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    screen: `${window.screen.width}x${window.screen.height}`,
  };
}

/**
 * Gets or creates a unique session ID for the current browser session.
 * @returns The session ID.
 */
export function getOrCreateSessionId() {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

/**
 * Checks if the given session ID matches the current session.
 * @param sessionId - The session ID to check.
 * @returns True if it matches the current session.
 */
export function isCurrentSession(sessionId?: string) {
  return sessionId === getOrCreateSessionId();
}

/**
 * Destroys the local browser session cache token.
 */
export function clearLocalSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
