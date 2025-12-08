import { FaRegClock } from "react-icons/fa6";
import { useAuth } from "@contexts/AuthContext";
import { useUserActivity } from "../hooks/useUserActivity";
import { getActivityDescription } from "../utils/activity";

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
              className="p-4 rounded-xl bg-gray-300 dark:bg-gray-600 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <FaRegClock className="inline-block mr-1" />
                <span className="font-semibold text-base text-white">
                  {getActivityDescription(act.action)}
                </span>
                <span className="flex items-center text-xs text-gray-400 ml-2 gap-1">
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
