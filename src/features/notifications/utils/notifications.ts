import i18n from "i18next";
import type { Action } from "@constants/actions";
import type { NotificationDetails } from "../types";

/**
 * Generates a notification message based on the action and details provided.
 * @param action - The action type for which the notification is generated.
 * @param details - Optional details that can be used to customize the notification message.
 * @returns A localized notification message string.
 */
export function getNotificationMessage(
  action: Action,
  details: NotificationDetails = {},
): string {
  const lng = i18n.language || "en";

  return i18n.t(`notifications:${action}`, {
    lng,
    defaultValue: i18n.t("notifications:defaultMessage"),
    ...details,
  });
}
