/**
 * Utility functions for logging and describing user activity events.
 */

import i18n from "i18next";
import type { JSX } from "react";
import { addDoc } from "firebase/firestore";
import { ICONS } from "@constants/icons";
import { formatTimeSeconds } from "@utils/date";
import { getUserCollection } from "@utils/firebase";
import type { ActivityDetails } from "../types";

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
  const lng = i18n.language || "en";
  const nsKey = String(action);
  const template = i18n.t(`activity:${nsKey}`, {
    lng,
    defaultValue: "{userName} did something.",
  });
  const safeDetails: Record<string, string> = {
    userName: details?.userName || "You",
    itemName: details?.itemName || "",
    location: details?.location || "",
    date: details?.date || "",
    ...Object.fromEntries(
      Object.entries(details ?? {}).map(([k, v]) => {
        if (k === "time") {
          return [k, typeof v === "number" ? formatTimeSeconds(v) : String(v)];
        }
        return [k, String(v)];
      }),
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
  if (n >= 101 && n <= 119) return <ICONS.account />;
  if (n === 120) return <ICONS.profile />;
  if (n === 130) return <ICONS.settings />;
  if (n === 140) return <ICONS.friends />;
  if (n === 200) return <ICONS.atlas />;
  if (n >= 210 && n <= 219) return <ICONS.layers />;
  if (n >= 220 && n <= 229) return <ICONS.markers />;
  if (n >= 230 && n <= 239) return <ICONS.savedMaps />;
  if (n >= 240 && n <= 249) return <ICONS.countryLists />;
  if (n >= 300 && n <= 309) return <ICONS.quizzes />;
  if (n >= 400 && n <= 415) return <ICONS.trips />;
  return <ICONS.activity />;
}

/** Gets the icon for a user activity based on its action code.
 * @param action - The action code for the activity.
 * @returns The icon component for the activity.
 */
export function getActivityIcon(action: string | number) {
  return getActivityIconByCode(action);
}
