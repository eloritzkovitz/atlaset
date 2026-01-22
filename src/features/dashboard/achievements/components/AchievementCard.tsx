import { Chip } from "@components";
import { Checklist } from "./Checklist";
import { AchievementStatusChip } from "./AchievementStatusChip";
import { useAchievementProgressLabel } from "../hooks/useAchievementProgressLabel";
import type { Country } from "@features/countries";
import type { Trip } from "@features/trips";
import { AchievementFlagGrid } from "./AchievementFlagGrid";
import { AchievementIcon } from "./AchievementIcon";
import { AchievementTierChip } from "./AchievementTierChip";
import {
  getTier,
  getAchievementStatus,
  getDisplayFlagCountries,
} from "../utils/achievements";
import type { Achievement, AchievementStatus } from "../../types";

interface AchievementCardProps {
  achievement: Achievement;
  countries: Country[];
  visited: { isCountryVisited: (iso: string) => boolean };
  trips?: Trip[];
  homeCountry?: string;
  achievementStatusMap?: Record<string, boolean>;
  allAchievements?: Achievement[];
}

export function AchievementCard({
  achievement,
  countries,
  visited,
  trips,
  homeCountry,
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

  // Defensive criteria default
  const criteria = achievement.criteria || {};

  // Check if achievement is dependency-only
  const isDependencyOnly =
    achievement.requires &&
    Array.isArray(achievement.requires) &&
    achievement.requires.length > 0 &&
    (!achievement.criteria || Object.keys(criteria).length === 0);

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

  // Determine tier object and status
  let tierIndex = 0;
  let tierObj = null;
  let tierStatus: AchievementStatus = status;
  let tierCount: number | undefined = undefined;
  if (
    achievement.tiers &&
    Array.isArray(achievement.tiers) &&
    achievement.tiers.length > 0
  ) {
    // Find highest completed tier, or next incomplete tier
    for (let i = achievement.tiers.length - 1; i >= 0; i--) {
      const t = achievement.tiers[i];
      // If using count-based tier, build a pseudo-achievement for status
      let tierAch = { ...achievement };
      if (typeof t.count === "number" && achievement.countries) {
        tierAch = {
          ...achievement,
          criteria: { countries: achievement.countries.slice(0, t.count) },
        };
      } else if (t.criteria) {
        tierAch = { ...achievement, criteria: t.criteria };
      }
      const completed =
        getAchievementStatus(
          tierAch,
          countries,
          visited,
          trips,
          homeCountry,
        ) === "completed";
      if (completed) {
        tierIndex = i;
        break;
      }
    }
    // If not completed, show next incomplete tier
    if (tierIndex < achievement.tiers.length - 1) {
      tierIndex++;
    }
    tierObj = achievement.tiers[tierIndex];
    let tierAch = { ...achievement };
    if (typeof tierObj.count === "number" && achievement.countries) {
      tierAch = {
        ...achievement,
        criteria: { countries: achievement.countries.slice(0, tierObj.count) },
      };
      tierCount = tierObj.count;
    } else if (tierObj.criteria) {
      tierAch = { ...achievement, criteria: tierObj.criteria };
    }
    tierStatus = getAchievementStatus(
      tierAch,
      countries,
      visited,
      trips,
      homeCountry,
    );
  }

  const displayName = tierObj?.name || achievement.name;
  const displayDescription = tierObj?.description || achievement.description;
  let displayCriteria = tierObj?.criteria || criteria;
  if (typeof tierCount === "number" && achievement.countries) {
    displayCriteria = { countries: achievement.countries.slice(0, tierCount) };
  }
  const displayTier = tierObj?.tier || tier;

  // Background and text color classes based on status
  const statusBgClasses: Record<AchievementStatus, string> = {
    locked: "bg-surface-alt/30",
    progress: "bg-surface-alt",
    completed: "bg-success/20",
  };
  const bgClass = statusBgClasses[tierStatus];
  const textClass = tierStatus === "locked" ? "text-muted" : "";

  // Chip color class for progress
  const progressChipClass = "bg-surface";

  // Get progress label
  const normalProgressLabel = useAchievementProgressLabel(
    { ...achievement, criteria: displayCriteria },
    countries,
    visited,
    trips,
    homeCountry,
    tierStatus,
  );

  // Use dependency progress for dependency-only achievements, else normal progress
  let progressLabel =
    isDependencyOnly && dependencyProgress
      ? dependencyProgress
      : normalProgressLabel;

  // Prepend "Progress: " for fraction-style progress labels
  if (typeof progressLabel === "string" && /^\d+\/\d+$/.test(progressLabel)) {
    progressLabel = `Progress: ${progressLabel}`;
  }

  // Only show tier chip if there is a tier
  const showTierChip =
    displayTier && achievement.tiers && achievement.tiers.length > 0;

  return (
    <div
      className={`rounded-xl p-5 flex flex-col items-center transition-shadow duration-200 ${bgClass} ${textClass} shadow-sm hover:shadow-lg select-none`}
      style={{ minHeight: 320, position: "relative" }}
    >
      <AchievementIcon
        type={achievement.type}
        locked={tierStatus === "locked"}
      />
      <h2 className="text-lg font-semibold mb-2 text-center leading-tight">
        {displayName}
      </h2>
      <p className="text-sm mb-3 text-center text-muted max-w-xs">
        {displayDescription}
      </p>
      <div className="flex gap-2 items-center mb-2 select-none">
        {showTierChip && (
          <AchievementTierChip
            tier={displayTier}
            totalTiers={achievement.tiers?.length}
          />
        )}
        <Chip className={progressChipClass}>{progressLabel}</Chip>
        <AchievementStatusChip status={tierStatus} />
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
      {displayCriteria.regions && Array.isArray(displayCriteria.regions) && (
        <div className="flex flex-col items-start w-full mb-2">
          <div className="ml-12">
            <Checklist
              items={displayCriteria.regions.map((region: string) => {
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
        const achCountries = getDisplayFlagCountries(
          achievement,
          displayCriteria,
          countries,
          tierCount,
        );
        if (achCountries.length > 0) {
          return (
            <>
              <div style={{ height: 12 }} />
              <AchievementFlagGrid
                countries={countries}
                countryCodes={achCountries.map((c) => c.isoCode)}
                visited={visited}
              />
            </>
          );
        }
        return null;
      })()}
    </div>
  );
}
