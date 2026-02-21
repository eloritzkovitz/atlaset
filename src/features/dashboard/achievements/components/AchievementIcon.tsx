import {
  FaMedal,
  FaTrophy,
  FaGlobe,
  FaCrown,
  FaLandmark,
  FaBoxesStacked,
  FaSuitcaseRolling,
} from "react-icons/fa6";
import type { Achievement } from "../types";

interface AchievementIconProps {
  type: Achievement["type"];
  locked: boolean;
}

export function AchievementIcon({ type, locked }: AchievementIconProps) {
  const iconProps = {
    className: `w-10 h-10 ${locked ? "text-muted" : "text-white drop-shadow"}`,
  };
  let icon;
  let bgClass = "";
  switch (type) {
    case "general":
      icon = <FaMedal {...iconProps} />;
      bgClass =
        "bg-gradient-to-br from-yellow-300 via-yellow-500 to-amber-400 ring-2 ring-yellow-200";
      break;
    case "milestone":
      icon = <FaTrophy {...iconProps} />;
      bgClass =
        "bg-gradient-to-br from-zinc-300 via-zinc-500 to-zinc-400 ring-2 ring-zinc-300";
      break;
    case "collection":
      icon = <FaBoxesStacked {...iconProps} />;
      bgClass =
        "bg-gradient-to-br from-green-300 via-green-500 to-emerald-400 ring-2 ring-green-300";
      break;
    case "geographic":
      icon = <FaGlobe {...iconProps} />;
      bgClass =
        "bg-gradient-to-br from-blue-300 via-blue-500 to-sky-400 ring-2 ring-blue-300";
      break;
    case "historic":
      icon = <FaCrown {...iconProps} />;
      bgClass =
        "bg-gradient-to-br from-red-300 via-red-500 to-rose-400 ring-2 ring-red-300";
      break;
    case "cultural":
      icon = <FaLandmark {...iconProps} />;
      bgClass =
        "bg-gradient-to-br from-purple-300 via-purple-500 to-fuchsia-400 ring-2 ring-purple-300";
      break;
    case "trips":
      icon = <FaSuitcaseRolling {...iconProps} />;
      bgClass =
        "bg-gradient-to-br from-orange-300 via-orange-500 to-amber-400 ring-2 ring-orange-300";
      break;
    default:
      icon = <FaMedal {...iconProps} />;
      bgClass =
        "bg-gradient-to-br from-yellow-300 via-yellow-500 to-amber-400 ring-2 ring-yellow-200";
  }
  return (
    <span
      className={`w-16 h-16 mb-3 rounded-full flex items-center justify-center shadow-lg ${
        locked ? "bg-muted/30 ring-2 ring-muted" : bgClass
      }`}
      aria-label="Achievement"
      style={{ marginBottom: 18 }}
    >
      {icon}
    </span>
  );
}
