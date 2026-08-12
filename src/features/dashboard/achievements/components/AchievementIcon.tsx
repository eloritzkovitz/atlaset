import {
  FaBoxesStacked,
  FaBuildingColumns,
  FaCrown,
  FaGlobe,
  FaMasksTheater,
  FaMedal,
  FaSuitcaseRolling,
  FaTrophy,
} from "react-icons/fa6";
import type { Achievement } from "../types";

interface AchievementIconProps {
  type: Achievement["type"];
  locked: boolean;
}

const CONFIG: Record<
  string,
  { icon: React.ComponentType<{ className?: string }>; bgClass: string }
> = {
  general: {
    icon: FaMedal,
    bgClass:
      "bg-gradient-to-br from-yellow-300 via-yellow-500 to-amber-400 ring-2 ring-yellow-200",
  },
  milestone: {
    icon: FaTrophy,
    bgClass:
      "bg-gradient-to-br from-zinc-300 via-zinc-500 to-zinc-400 ring-2 ring-zinc-300",
  },
  collection: {
    icon: FaBoxesStacked,
    bgClass:
      "bg-gradient-to-br from-green-300 via-green-500 to-emerald-400 ring-2 ring-green-300",
  },
  geographic: {
    icon: FaGlobe,
    bgClass:
      "bg-gradient-to-br from-blue-300 via-blue-500 to-sky-400 ring-2 ring-blue-300",
  },
  historic: {
    icon: FaCrown,
    bgClass:
      "bg-gradient-to-br from-red-300 via-red-500 to-rose-400 ring-2 ring-red-300",
  },
  cultural: {
    icon: FaMasksTheater,
    bgClass:
      "bg-gradient-to-br from-purple-300 via-purple-500 to-fuchsia-400 ring-2 ring-purple-300",
  },
  affiliation: {
    icon: FaBuildingColumns,
    bgClass:
      "bg-gradient-to-br from-teal-300 via-teal-500 to-emerald-400 ring-2 ring-teal-300",
  },
  trips: {
    icon: FaSuitcaseRolling,
    bgClass:
      "bg-gradient-to-br from-orange-300 via-orange-500 to-amber-400 ring-2 ring-orange-300",
  },
};

export function AchievementIcon({ type, locked }: AchievementIconProps) {
  const { icon: IconComponent, bgClass } = CONFIG[type] ?? CONFIG.general;

  const activeBgClass = locked ? "bg-muted/30 ring-2 ring-muted" : bgClass;
  const iconClassName = `w-10 h-10 ${locked ? "text-muted" : "text-white drop-shadow"}`;

  return (
    <span
      className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${activeBgClass}`}
      aria-label="Achievement"
      style={{ marginBottom: 18 }}
    >
      <IconComponent className={iconClassName} />
    </span>
  );
}
