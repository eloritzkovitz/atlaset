/**
 * Utility functions for logging and describing user activity events.
 */

import { addDoc } from "firebase/firestore";
import i18n from "i18next";
import type { ComponentType, SVGProps } from "react";
import { analytics } from "@app/firebase";
import { ICONS } from "@constants/icons";
import { logToGoogleAnalytics } from "@utils/analytics";
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

  // Log to Google Analytics if available
  if (analytics) {
    const eventName = getEventName(action);
    logToGoogleAnalytics(eventName, details, action);
  }
}

/**
 * Sanitizes the details object for analytics logging by removing sensitive information.
 * @param details The original details object.
 * @returns A sanitized version of the details object.
 */
export function getEventName(actionId: number): string {
  const template = i18n.t(`activity:${actionId}`, {
    lng: "en",
    defaultValue: "",
  });

  if (!template) return `action_${actionId}`;

  const clean = template
    .replace(/{userName}/gi, "")
    .replace(/{date}/gi, "")
    .replace(/[{}]/g, "")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

  return clean.substring(0, 40).replace(/_$/, "") || `action_${actionId}`;
}

export interface DescriptionSegment {
  text: string;
  type: "text" | "item" | "username";
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
  const segments: DescriptionSegment[] = [];

  while ((match = splitRegex.exec(filled))) {
    if (match.index > lastIndex) {
      segments.push({
        text: filled.slice(lastIndex, match.index),
        type: "text",
      });
    }
    segments.push({ text: match[1], type: "item" });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < filled.length) {
    segments.push({ text: filled.slice(lastIndex), type: "text" });
  }

  return segments.flatMap((segment) => {
    if (segment.type === "text" && segment.text.includes("__USERNAME__")) {
      return segment.text
        .split("__USERNAME__")
        .flatMap((seg, j, arr) => [
          ...(seg ? [{ text: seg, type: "text" as const }] : []),
          ...(j < arr.length - 1
            ? [{ text: safeDetails.userName, type: "username" as const }]
            : []),
        ]);
    }
    return [segment];
  });
}

/**
 * Gets the icon associated with a user activity event.
 * @param action - The action code (number or string).
 * @returns The Icon Component reference.
 */
export function getActivityIcon(
  action: string | number,
): ComponentType<SVGProps<SVGSVGElement>> {
  const n = typeof action === "string" ? parseInt(action, 10) : action;

  if (n >= 101 && n <= 119) return ICONS.account;
  if (n === 120) return ICONS.profile;
  if (n === 130) return ICONS.settings;
  if (n === 140) return ICONS.friends;
  if (n === 200) return ICONS.atlas;
  if (n >= 210 && n <= 219) return ICONS.layers;
  if (n >= 220 && n <= 229) return ICONS.markers;
  if (n >= 230 && n <= 239) return ICONS.savedMaps;
  if (n >= 240 && n <= 249) return ICONS.countryLists;
  if (n >= 300 && n <= 309) return ICONS.quizzes;
  if (n >= 400 && n <= 415) return ICONS.trips;

  return ICONS.activity;
}
