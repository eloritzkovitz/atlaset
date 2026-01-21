import {
  FaMedal,
  FaTrophy,
  FaGlobe,
  FaCrown,
  FaLandmark,
  FaBoxesStacked,
} from "react-icons/fa6";
import type { Achievement } from "../../types";

interface AchievementIconProps {
  type: Achievement["type"];
  locked: boolean;
}

export function AchievementIcon({ type, locked }: AchievementIconProps) {
  const iconProps = {
    className: `w-10 h-10 ${locked ? "text-muted" : "text-white drop-shadow"}`,
  };
  let icon;
  switch (type) {
    case "general":
      icon = <FaMedal {...iconProps} />;
      break;
    case "milestone":
      icon = <FaTrophy {...iconProps} />;
      break;
    case "collection":
      icon = <FaBoxesStacked {...iconProps} />;
      break;
    case "geographic":
      icon = <FaGlobe {...iconProps} />;
      break;
    case "historic":
      icon = <FaCrown {...iconProps} />;
      break;
    case "cultural":
      icon = <FaLandmark {...iconProps} />;
      break;
    default:
      icon = <FaMedal {...iconProps} />;
  }
  return (
    <span
      className={`w-16 h-16 mb-3 rounded-full flex items-center justify-center shadow-lg ${
        locked
          ? "bg-muted/30 ring-2 ring-muted"
          : "bg-gradient-to-br from-yellow-300 via-yellow-500 to-amber-400 ring-2 ring-yellow-200"
      }`}
      aria-label="Achievement"
      style={{ marginBottom: 18 }}
    >
      {icon}
    </span>
  );
}
