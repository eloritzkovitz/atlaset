import { FaMedal } from "react-icons/fa6";
import type { Country } from "@features/countries";
import { AchievementFlagGrid } from "./AchievementFlagGrid";
import {
  getProgress,
  getTier,
  getAchievementStatus,
} from "../utils/achievements";
import type { Achievement, AchievementStatus } from "../../types";

interface AchievementCardProps {
  achievement: Achievement;
  countries: Country[];
  visited: { isCountryVisited: (iso: string) => boolean };
  tierBgClasses: Record<number, string>;
  statusBgClasses: Record<AchievementStatus, string>;
}

export function AchievementCard({
  achievement,
  countries,
  visited,
  tierBgClasses,
  statusBgClasses,
}: AchievementCardProps) {
  const tier = getTier(achievement);
  const status = getAchievementStatus(achievement, countries, visited);
  const bgClass = tier
    ? tierBgClasses[tier] || tierBgClasses[6]
    : statusBgClasses[status];
  const textClass = status === "locked" ? "text-muted" : "";

  return (
    <div
      className={`rounded-lg p-4 flex flex-col items-center ${bgClass} ${textClass}`}
      style={{}}
    >
      <span
        className="w-16 h-16 mb-2 rounded-full flex items-center justify-center bg-gradient-to-br from-yellow-300 via-yellow-500 to-amber-400 shadow-sm"
        aria-label="Achievement"
      >
        <FaMedal className="w-10 h-10 text-white" />
      </span>
      <h2 className="text-lg font-semibold mb-1">{achievement.name}</h2>
      <p className="text-sm mb-2 text-center">{achievement.description}</p>
      <span className="font-mono text-xs mb-1">
        Progress: {getProgress(achievement, countries, visited)}
      </span>
      <span
        className={`text-xs font-bold`}
        style={{
          color:
            status === "completed"
              ? "var(--color-success)"
              : status === "progress"
                ? "var(--color-info)"
                : "var(--color-muted)",
        }}
      >
        {status === "completed"
          ? "Completed!"
          : status === "progress"
            ? "In Progress"
            : "Locked"}
      </span>
      {achievement.criteria.countries &&
        Array.isArray(achievement.criteria.countries) && (
          <>
            <div style={{ height: 12 }} />
            <AchievementFlagGrid
              countries={countries}
              countryCodes={achievement.criteria.countries}
              visited={visited}
            />
          </>
        )}
    </div>
  );
}
