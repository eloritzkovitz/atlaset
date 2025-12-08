import { FaRegClock } from "react-icons/fa6";
import { getActivityDescription } from "../../utils/activity";

export function UserActivityItem({ act }: { act: any }) {
  return (
    <li className="p-4 rounded-xl bg-gray-300 dark:bg-gray-600 flex flex-col gap-2">
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
  );
}
