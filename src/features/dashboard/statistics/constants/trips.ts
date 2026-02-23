import {
  FaCalendarDay,
  FaCheck,
  FaClipboardList,
  FaLocationDot,
  FaPlane,
} from "react-icons/fa6";

export const TRIP_TYPE_COLORS = ["#4ade80", "#a78bfa"];
export const TRIP_TYPE_LABELS = ["Local", "Abroad"];
export const TRIP_TYPE_ICONS = [FaLocationDot, FaPlane];
export const TRIP_TYPE_COLOR_CLASSES = [
  "bg-green-400/60 text-green-100",
  "bg-purple-400/60 text-purple-100",
];

export const TRIP_STATUS_COLORS = ["#f59e42", "#fde047", "#22d3ee"];
export const TRIP_STATUS_LABELS = ["Planned", "Upcoming", "Completed"];
export const TRIP_STATUS_ICONS = [FaClipboardList, FaCalendarDay, FaCheck];
export const TRIP_STATUS_COLOR_CLASSES = [
  "bg-amber-500/60 text-gray-100",
  "bg-yellow-400/60 text-yellow-100",
  "bg-cyan-400/60 text-cyan-100",
];
