import { Chip } from "@components";
import type { Country } from "@features/countries";
import type { Trip } from "@features/trips";
import { AchievementFlagGrid } from "./AchievementFlagGrid";
import { AchievementMedal } from "./AchievementMedal";
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
  trips?: Trip[];
  homeCountry?: string;
  tierBgClasses: Record<number, string>;
  statusBgClasses: Record<AchievementStatus, string>;
}

export function AchievementCard({
  achievement,
  countries,
  visited,
  trips,
  homeCountry,
  tierBgClasses,
  statusBgClasses,
}: AchievementCardProps) {
  const tier = getTier(achievement);
  const status = getAchievementStatus(achievement, countries, visited, trips, homeCountry);

  // Determine background class based on tier or status
  const bgClass =
    tier && status !== "locked"
      ? tierBgClasses[tier] || tierBgClasses[6]
      : statusBgClasses[status];
  const textClass = status === "locked" ? "text-muted" : "";
  const statusLabel =
    status === "completed"
      ? "Completed"
      : status === "progress"
        ? "In Progress"
        : "Locked";

  // Chip color classes for status
  const statusChipClass =
    status === "completed"
      ? "bg-success/50"
      : status === "progress"
        ? "bg-info/70"
        : "bg-muted/20 text-muted";

  // Chip color classes for progress
  const progressChipClass = "bg-surface";

  return (
    <div
      className={`rounded-xl p-5 flex flex-col items-center transition-shadow duration-200 ${bgClass} ${textClass} shadow-sm hover:shadow-lg select-none`}
      style={{ minHeight: 320, position: "relative" }}
    >
      <AchievementMedal locked={status === "locked"} />
      <h2 className="text-lg font-semibold mb-2 text-center leading-tight">
        {achievement.name}
      </h2>
      <p className="text-sm mb-3 text-center text-muted max-w-xs">
        {achievement.description}
      </p>
      <div className="flex gap-2 items-center mb-2 select-none">
        {/* Custom progress for trip-based achievements */}
        {achievement.criteria.trip_countries_count && achievement.criteria.region ? (
          <Chip className={progressChipClass}>
            {status === "completed"
              ? `Trip completed`
              : `No qualifying trip yet`}
          </Chip>
        ) : (
          <Chip className={progressChipClass}>
            Progress: {getProgress(achievement, countries, visited, trips, homeCountry)}
          </Chip>
        )}
        <Chip className={statusChipClass}>{statusLabel}</Chip>
      </div>
      {/* Show flags for country or subregion criteria */}
      {(() => {
        // If criteria is countries
        if (
          achievement.criteria.countries &&
          Array.isArray(achievement.criteria.countries)
        ) {
          return (
            <>
              <div style={{ height: 12 }} />
              <AchievementFlagGrid
                countries={countries}
                countryCodes={achievement.criteria.countries}
                visited={visited}
              />
            </>
          );
        }
        // If criteria is subregion
        if (
          achievement.criteria.subregion &&
          typeof achievement.criteria.subregion === "string"
        ) {
          // Only include sovereign countries in the subregion
          const subregionCountryCodes = countries
            .filter(
              (c) =>
                c.subregion === achievement.criteria.subregion &&
                (c.sovereigntyType === undefined ||
                  c.sovereigntyType === "Sovereign"),
            )
            .map((c) => c.isoCode)
            .filter(Boolean);
          if (subregionCountryCodes.length > 0) {
            return (
              <>
                <div style={{ height: 12 }} />
                <AchievementFlagGrid
                  countries={countries}
                  countryCodes={subregionCountryCodes}
                  visited={visited}
                />
              </>
            );
          }
        }
        return null;
      })()}
    </div>
  );
}
