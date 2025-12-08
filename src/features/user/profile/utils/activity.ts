/**
 * Gets a human-readable description for a user activity action.
 * @param action The action type.
 * @returns A human-readable description of the action.
 */
export function getActivityDescription(action: string) {
  switch (action) {
    case "save_overlays":
      return "has saved overlays";
    case "add_overlay":
      return "has added an overlay";
    case "edit_overlay":
      return "has edited an overlay";
    case "remove_overlay":
      return "has removed an overlay";
    case "save_markers":
      return "has saved markers";
    case "add_marker":
      return "has added a marker";
    case "edit_marker":
      return "has edited a marker";
    case "remove_marker":
      return "has removed a marker";
    case "save_trips":
      return "has saved trips";
    case "add_trip":
      return "has added a trip";
    case "edit_trip":
      return "has edited a trip";
    case "remove_trip":
      return "has removed a trip";
    case "edit_settings":
      return "has updated settings";
    case "edit_profile":
      return "has updated their profile";
    case "login":
      return "has signed in";
    case "logout":
      return "has signed out";
    case "signup":
      return "has created an account";
    default:
      return action.replace(/_/g, " ");
  }
}
