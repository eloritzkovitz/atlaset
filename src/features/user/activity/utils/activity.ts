/**
 * Gets a human-readable, full sentence description for a user activity action.
 * @param action The action type.
 * @param details Optional details about the activity (itemName, location, date, userName).
 * @returns A human-readable description of the action.
 */
export function getActivityDescription(
  action: string,
  details?: {
    itemName?: string;
    location?: string;
    date?: string;
    userName?: string;
  }
) {
  const name = details?.userName || "You";
  const item = details?.itemName ? ` "${details.itemName}"` : "";
  const loc = details?.location ? ` in ${details.location}` : "";
  const date = details?.date ? ` on ${details.date}` : "";

  switch (action) {
    case "save_overlays":
      return `${name} saved overlays${loc}${date}.`;
    case "add_overlay":
      return `${name} added an overlay${item}${loc}${date}.`;
    case "edit_overlay":
      return `${name} edited an overlay${item}${loc}${date}.`;
    case "remove_overlay":
      return `${name} removed an overlay${item}${loc}${date}.`;
    case "save_markers":
      return `${name} saved markers${loc}${date}.`;
    case "add_marker":
      return `${name} added a marker${item}${loc}${date}.`;
    case "edit_marker":
      return `${name} edited a marker${item}${loc}${date}.`;
    case "remove_marker":
      return `${name} removed a marker${item}${loc}${date}.`;
    case "save_trips":
      return `${name} saved trips${loc}${date}.`;
    case "add_trip":
      return `${name} added a trip${item}${loc}${date}.`;
    case "edit_trip":
      return `${name} edited a trip${item}${loc}${date}.`;
    case "remove_trip":
      return `${name} removed a trip${item}${loc}${date}.`;
    case "edit_settings":
      return `${name} updated settings${date}.`;
    case "edit_profile":
      return `${name} updated their profile${date}.`;
    case "login":
      return `${name} signed in${date}.`;
    case "logout":
      return `${name} signed out${date}.`;
    case "signup":
      return `${name} created an account${date}.`;
    default:
      return `${name} ${action.replace(/_/g, " ")}${item}${loc}${date}.`;
  }
}
