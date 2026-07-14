/**
 * Utility functions for analytics logging and sanitization.
 */

import { analytics } from "@app/firebase";
import { logEvent } from "firebase/analytics";

/** List of keys that are considered personally identifiable information (PII) and should be sanitized. */
const FORBIDDEN_PII_KEYS = [
  "uid",
  "email",
  "username",
  "displayname",
  "firstname",
  "lastname",
  "location",
  "phone",
  "password",
  "photourl",
];

export type SafeDetailsRecord = { [key: string]: unknown };

/**
 * Sanitizes the details object for analytics logging by removing sensitive information.
 * @param details - The details object to sanitize.
 * @returns A sanitized version of the details object.
 */
export function sanitizeDetails(details: object): SafeDetailsRecord {
  const clean: SafeDetailsRecord = {};

  for (const [key, value] of Object.entries(details)) {
    if (FORBIDDEN_PII_KEYS.includes(key.toLowerCase())) {
      continue;
    }

    if (typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      continue;
    }

    if (value && typeof value === "object" && !Array.isArray(value)) {
      clean[key] = sanitizeDetails(value as Record<string, unknown>);
    } else {
      clean[key] = value;
    }
  }

  return clean;
}

/**
 * Logs an event to Google Analytics if analytics is initialized.
 * @param actionId - The action ID representing the activity.
 * @param details - Additional details about the activity.
 */
export function logToGoogleAnalytics(
  eventName: string,
  details: object,
  actionId?: number,
) {
  if (!analytics) return;
  try {
    const safeDetails = sanitizeDetails(details);
    logEvent(analytics, eventName, {
      ...safeDetails,
      ...(actionId !== undefined && { action_id: actionId }),
    });
  } catch (error) {
    console.error("Failed to log to Google Analytics:", error);
  }
}
