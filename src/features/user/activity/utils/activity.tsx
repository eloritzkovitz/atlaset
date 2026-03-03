/**
 * Utility functions for logging and describing user activity events.
 */

import type { JSX } from "react";
import {
  FaUser,
  FaGear,
  FaEarthAmericas,
  FaLayerGroup,
  FaMap,
  FaMapPin,
  FaQuestion,
  FaRegClock,
  FaSuitcaseRolling,
  FaUsers,
  FaCircleUser,
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

  // Replace placeholders, render quoted and username as bold
  const filled = template.replace(/\{(\w+)\}/g, (_, key) =>
    key === "userName" ? "__USERNAME__" : (safeDetails[key] ?? ""),
  );

  // Split by quoted text, preserving quoted and non-quoted segments
  const splitRegex = /'([^']+)'/g;
  let lastIndex = 0;
  let match;
  const parts: Array<string | JSX.Element> = [];
  while ((match = splitRegex.exec(filled))) {
    if (match.index > lastIndex)
      parts.push(filled.slice(lastIndex, match.index));
    parts.push(
      <span key={match.index} className="text-info font-bold">
        {match[1]}
      </span>,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < filled.length) parts.push(filled.slice(lastIndex));

  // Replace __USERNAME__ in string segments with bold span
  const finalParts = parts.flatMap((part, i) => {
    if (typeof part === "string" && part.includes("__USERNAME__")) {
      return part
        .split("__USERNAME__")
        .flatMap((seg, j, arr) => [
          seg,
          ...(j < arr.length - 1
            ? [
                <span
                  key={`username-${i}-${j}`}
                  className="font-bold text-action-text-hover"
                >
                  {safeDetails.userName}
                </span>,
              ]
            : []),
        ])
        .filter(Boolean);
    }
    return [part];
  });

  return <>{finalParts}</>;
}

// Map activity codes to icons
function getActivityIconByCode(code: number | string): JSX.Element {
  const n = typeof code === "string" ? parseInt(code, 10) : code;
  if (n >= 101 && n <= 119) return <FaCircleUser />;
  if (n === 120) return <FaUser />;
  if (n === 130) return <FaGear />;
  if (n === 140) return <FaUsers />;
  if (n === 200) return <FaEarthAmericas />;
  if (n >= 210 && n <= 219) return <FaLayerGroup />;
  if (n >= 220 && n <= 229) return <FaMapPin />;
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
