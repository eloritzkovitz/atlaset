/**
 * Utility functions for logging and describing user activity events.
 */
import type { JSX } from "react";
import {
  FaUser,
  FaGear,
  FaEarthAmericas,
  FaLayerGroup,
  FaMarker,
  FaMap,
  FaQuestion,
  FaSuitcaseRolling,
  FaUsers,
  FaRegClock,
} from "react-icons/fa6";
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
  details: object,
  uid: string,
) {
  const activityCollection = getUserCollection("activity");
  await addDoc(activityCollection, {
    action,
    details,
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
  details?: ActivityDetails,
) {
  const template =
    activityTemplates[String(action)] || "{userName} did something.";
  const safeDetails: Record<string, string> = {
    userName: details?.userName || "You",
    itemName: details?.itemName || "",
    location: details?.location || "",
    date: details?.date || "",
    ...Object.fromEntries(
      Object.entries(details ?? {}).map(([k, v]) => [k, String(v)]),
    ),
  };
  // Replace placeholders
  const filled = template.replace(
    /\{(\w+)\}/g,
    (_: string, key: string) => safeDetails[key] ?? "",
  );
  // Split by quoted text and render colored spans for quoted text
  const parts = [];
  let lastIndex = 0;
  filled.replace(/'([^']+)'/g, (match, quoted, offset) => {
    if (offset > lastIndex) parts.push(filled.slice(lastIndex, offset));
    parts.push(
      <span key={offset} className="text-info font-bold">
        {quoted}
      </span>,
    );
    lastIndex = offset + match.length;
    return match;
  });
  if (lastIndex < filled.length) parts.push(filled.slice(lastIndex));
  // If template ends with a dot, ensure a dot is rendered at the end
  if (
    /\.$/.test(template) &&
    (parts.length === 0 || !String(parts[parts.length - 1]).endsWith("."))
  ) {
    parts.push(<span key="dot">.</span>);
  }
  return <>{parts}</>;
}

// Map activity codes to icons
function getActivityIconByCode(code: number | string): JSX.Element {
  const n = typeof code === "string" ? parseInt(code, 10) : code;
  if ([101, 102, 103, 104, 110, 111, 120].includes(n)) return <FaUser />;
  if (n === 130) return <FaGear />;
  if (n === 140) return <FaUsers />;
  if (n === 200) return <FaEarthAmericas />;
  if ((n >= 210 && n <= 219) || [234, 235, 236].includes(n))
    return <FaLayerGroup />;
  if ((n >= 220 && n <= 229) || [237, 238, 239].includes(n))
    return <FaMarker />;
  if (n >= 230 && n <= 239) return <FaMap />;
  if (n >= 300 && n <= 309) return <FaQuestion />;
  if (n >= 400 && n <= 415) return <FaSuitcaseRolling />;
  return <FaRegClock />;
}

/** Gets the icon for a user activity based on its action code.
 * @param action - The action code for the activity.
 * @returns The icon component for the activity.
 */
export function getActivityIcon(action: string | number) {
  return getActivityIconByCode(action);
}
