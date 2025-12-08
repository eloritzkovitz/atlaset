import { useAuth } from "@contexts/AuthContext";
import { useUserActivity } from "../../hooks/useUserActivity";
import { FaRegClock } from "react-icons/fa6";

function getActivityDescription(action: string) {
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

export function UserActivitySection() {
  const { user } = useAuth();
  const { activity, loading: activityLoading } = useUserActivity(user?.uid);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Activity</h3>
      {activityLoading ? (
        <div className="text-gray-400">Loading...</div>
      ) : activity.length === 0 ? (
        <div className="text-gray-400">No activity yet.</div>
      ) : (
        <ul className="space-y-4">
          {activity.map((act) => (
            <li
              key={act.id}
              className="p-5 rounded-xl bg-gray-300 dark:bg-gray-600 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-base text-white">
                  {getActivityDescription(act.action)}
                </span>
                <span className="flex items-center text-xs text-gray-400 ml-2 gap-1">
                  <FaRegClock className="inline-block mr-1" />
                  {new Date(act.timestamp).toLocaleString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
