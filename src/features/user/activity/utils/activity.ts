/**
 * @file Utility functions for logging and describing user activity events.
 */

import { addDoc } from "firebase/firestore";
import { getUserCollection } from "@utils/firebase";
import activityTemplatesJson from "./activityTemplates.json";
import type { ActivityDetails } from "../../types";

// Load activity templates from JSON
export const activityTemplates: Record<string, string> = activityTemplatesJson;

/**
 * Logs a user activity event to Firestore.
 * @param event The event number representing the activity.
 * @param data Additional data related to the activity.
 * @param uid The user ID for whom the activity is logged.
 */
export async function logUserActivity(
  action: number,
  data: object,
  uid: string
) {
  const activityCollection = getUserCollection("activity");
  await addDoc(activityCollection, {
    action,
    data,
    uid,
    timestamp: Date.now(),
  });
}

/**
 * Gets a human-readable, full sentence description for a user activity event.
 * @param eventType The event number (as string or number).
 * @param details Optional details about the activity (itemName, location, date, userName, etc).
 * @returns A human-readable description of the event.
 */
export function getActivityDescription(
  action: number | string,
  details?: ActivityDetails
) {
  const template =
    activityTemplates[String(action)] || "{userName} did something.";
  // Provide sensible defaults for placeholders
  const safeDetails: Record<string, unknown> = {
    userName: details?.userName || "You",
    itemName: details?.itemName || "",
    location: details?.location || "",
    date: details?.date || "",
    ...details,
  };
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = safeDetails[key];
    if (value !== undefined && value !== null) {
      return String(value);
    }
    return "";
  });
}
