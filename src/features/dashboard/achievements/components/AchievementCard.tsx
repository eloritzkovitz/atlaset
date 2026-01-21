import { Chip } from "@components";
import { Checklist } from "./Checklist";
import { AchievementStatusChip } from "./AchievementStatusChip";
import { useAchievementProgressLabel } from "../hooks/useAchievementProgressLabel";
import type { Country } from "@features/countries";
import type { Trip } from "@features/trips";
import { AchievementFlagGrid } from "./AchievementFlagGrid";
import { AchievementIcon } from "./AchievementIcon";
import { getTier, getAchievementStatus } from "../utils/achievements";
import type { Achievement, AchievementStatus } from "../../types";

interface AchievementCardProps {
  achievement: Achievement;
  countries: Country[];
  visited: { isCountryVisited: (iso: string) => boolean };
  trips?: Trip[];
  homeCountry?: string;
  tierBgClasses: Record<number, string>;
  statusBgClasses: Record<AchievementStatus, string>;
  achievementStatusMap?: Record<string, boolean>;
  allAchievements?: Achievement[];
}

export function AchievementCard({
  achievement,
  countries,
  visited,
  trips,
  homeCountry,
  tierBgClasses,
  statusBgClasses,
  achievementStatusMap,
  allAchievements,
}: AchievementCardProps) {
  const tier = getTier(achievement);

  // Dependency progress logic
  let dependencyProgress = null;
  let dependencyStatus: AchievementStatus | null = null;
  if (
    achievement.requires &&
    Array.isArray(achievement.requires) &&
    achievement.requires.length > 0 &&
    achievementStatusMap
  ) {
    const completedCount = achievement.requires.filter(
      (reqId) => achievementStatusMap[reqId],
    ).length;
    dependencyProgress = `${completedCount}/${achievement.requires.length}`;
    if (completedCount === achievement.requires.length) {
      dependencyStatus = "completed";
    } else if (completedCount > 0) {
      dependencyStatus = "progress";
    } else {
      dependencyStatus = "locked";
    }
  }

  // Check if achievement is dependency-only
  const isDependencyOnly =
    achievement.requires &&
    Array.isArray(achievement.requires) &&
    achievement.requires.length > 0 &&
    (!achievement.criteria || Object.keys(achievement.criteria).length === 0);

  // Determine achievement status, prioritizing dependency status if applicable
  const status =
    isDependencyOnly && dependencyStatus
      ? dependencyStatus
      : getAchievementStatus(
          achievement,
          countries,
          visited,
          trips,
          homeCountry,
        );

  // Determine background class based on tier or status
  const bgClass =
    tier && status !== "locked"
      ? tierBgClasses[tier] || tierBgClasses[6]
      : statusBgClasses[status];
  const textClass = status === "locked" ? "text-muted" : "";

  // Chip color classes for progress
  const progressChipClass = "bg-surface";

  // Get progress label
  const normalProgressLabel = useAchievementProgressLabel(
    achievement,
    countries,
    visited,
    trips,
    homeCountry,
    status,
  );

  // Use dependency progress for dependency-only achievements, else normal progress
  let progressLabel =
    isDependencyOnly && dependencyProgress
      ? dependencyProgress
      : normalProgressLabel;

  // Prepend "Progress: " for fraction-style progress labels
  if (/^\d+\/\d+$/.test(progressLabel)) {
    progressLabel = `Progress: ${progressLabel}`;
  }

  return (
    <div
      className={`rounded-xl p-5 flex flex-col items-center transition-shadow duration-200 ${bgClass} ${textClass} shadow-sm hover:shadow-lg select-none`}
      style={{ minHeight: 320, position: "relative" }}
    >
      <AchievementIcon type={achievement.type} locked={status === "locked"} />
      <h2 className="text-lg font-semibold mb-2 text-center leading-tight">
        {achievement.name}
      </h2>
      <p className="text-sm mb-3 text-center text-muted max-w-xs">
        {achievement.description}
      </p>
      <div className="flex gap-2 items-center mb-2 select-none">
        <Chip className={progressChipClass}>{progressLabel}</Chip>
        <AchievementStatusChip status={status} />
      </div>

      {/* Checklist for required achievements (dependencies) */}
      {achievement.requires &&
        Array.isArray(achievement.requires) &&
        achievement.requires.length > 0 &&
        achievementStatusMap &&
        allAchievements && (
          <div className="flex flex-col items-start w-full mb-2">
            <div className="ml-12">
              <Checklist
                items={achievement.requires.map((reqId) => {
                  const completed = achievementStatusMap[reqId] || false;
                  const reqAchievement = allAchievements.find(
                    (a) => a.id === reqId,
                  );
                  const label = reqAchievement ? reqAchievement.name : reqId;
                  return { label, completed };
                })}
              />
            </div>
          </div>
        )}

      {/* Region details for region achievements */}
      {achievement.criteria.regions &&
        Array.isArray(achievement.criteria.regions) && (
          <div className="flex flex-col items-start w-full mb-2">
            <div className="ml-12">
              <Checklist
                items={achievement.criteria.regions.map((region: string) => {
                  const countriesInRegion = countries.filter(
                    (c) => c.region === region,
                  );
                  const visitedAny = countriesInRegion.some((c) =>
                    visited.isCountryVisited(c.isoCode),
                  );
                  return { label: region, completed: visitedAny };
                })}
              />
            </div>
          </div>
        )}
      {(() => {
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
        if (
          achievement.criteria.subregion &&
          typeof achievement.criteria.subregion === "string"
        ) {
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
