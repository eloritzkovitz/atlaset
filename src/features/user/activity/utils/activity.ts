import { addDoc } from "firebase/firestore";
import { getUserCollection } from "@utils/firebase";
import activityTemplatesJson from "./activityTemplates.json";

// Load activity templates from JSON
const activityTemplates: Record<string, string> = activityTemplatesJson;

/**
 * Logs a user activity event to Firestore.
 * @param event The event number representing the activity.
 * @param data Additional data related to the activity.
 * @param uid The user ID for whom the activity is logged.
 */
export async function logUserActivity(
  event: number,
  data: object,
  uid: string
) {
  const activityCollection = getUserCollection("activity");
  await addDoc(activityCollection, {
    event,
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
  eventType: number | string,
  details: Record<string, unknown> = {}
) {
  const template =
    activityTemplates[String(eventType)] || "{userName} did something.";
  // Replace {placeholders} in the template with values from details
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = details[key];
    if (value !== undefined && value !== null) {
      return String(value);
    }
    // Provide some sensible defaults
    if (key === "userName") return "You";
    if (
      key === "date" ||
      key === "location" ||
      key === "itemName" ||
      key === "friendName"
    )
      return "";
    return `{${key}}`;
  });
}
