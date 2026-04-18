import { AchievementProgressChip } from "./AchievementProgressChip";
import { Checklist } from "./Checklist";
import { AchievementStatusChip } from "./AchievementStatusChip";
import { useAchievementProgressLabel } from "../hooks/useAchievementProgressLabel";
import type { Country } from "@features/countries";
import type { Trip } from "@features/trips";
import { AchievementFlagGrid } from "./AchievementFlagGrid";
import { AchievementIcon } from "./AchievementIcon";
import { AchievementTierChip } from "./AchievementTierChip";
import { getDisplayFlagCountries } from "../utils/achievementsDisplay";
import { getTier, getCurrentTier } from "../utils/achievementsTiers";
import type { Achievement, AchievementStatus } from "../types";

interface AchievementCardProps {
  achievement: Achievement;
  countries: Country[];
  visited: { isCountryVisited: (iso: string) => boolean };
  trips?: Trip[];
  homeCountry?: string;
  achievementStatusMap?: Record<string, boolean>;
  allAchievements?: Achievement[];
  onClick?: () => void;
}

export function AchievementCard({
  achievement,
  countries,
  visited,
  trips,
  homeCountry,
  achievementStatusMap,
  allAchievements,
  onClick,
}: AchievementCardProps) {
  // Defensive criteria default
  const criteria = achievement.criteria || {};

  // Get current tier info
  const { tierObj, tierStatus, tierCount } = getCurrentTier(
    achievement,
    countries,
    visited,
    trips,
    homeCountry,
  );

  // Display values
  const displayName = tierObj?.name || achievement.name;
  const displayDescription = tierObj?.description || achievement.description;
  let displayCriteria = tierObj?.criteria || criteria;
  if (typeof tierCount === "number" && achievement.countries) {
    displayCriteria = { countries: achievement.countries.slice(0, tierCount) };
  }
  const displayTier = tierObj?.tier || getTier(achievement);

  // Background and text color classes based on status
  const statusBgClasses: Record<AchievementStatus, string> = {
    locked: "bg-surface-alt/30",
    progress: "bg-surface-alt",
    completed: "bg-success/20",
  };
  const bgClass = statusBgClasses[tierStatus as AchievementStatus];
  const textClass = tierStatus === "locked" ? "text-muted" : "";

  // Get progress label
  const progressLabel = useAchievementProgressLabel(
    { ...achievement, criteria: displayCriteria },
    countries,
    visited,
    achievementStatusMap,
  );

  // Only show tier chip if there is a tier
  const showTierChip =
    displayTier && achievement.tiers && achievement.tiers.length > 0;

  return (
    <div
      className={`rounded-xl p-5 flex flex-col items-center transition-shadow duration-200 ${bgClass} ${textClass} shadow-sm hover:scale-105 hover:bg-primary/20 select-none`}
      style={{
        minHeight: 320,
        position: "relative",
        cursor: onClick ? "pointer" : undefined,
      }}
      onClick={onClick}
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
            tiers={
              achievement.tiers
                ? achievement.tiers.map((t, idx) => ({
                    tier: t.tier ?? idx + 1,
                    count: t.criteria?.required_count ?? t.count,
                    description: t.description,
                  }))
                : undefined
            }
          />
        )}
        <AchievementProgressChip label={progressLabel} className="bg-surface" />
        <AchievementStatusChip status={tierStatus} />
      </div>

      {/* Checklist for required achievements (dependencies) */}
      {achievement.requires &&
        Array.isArray(achievement.requires) &&
        achievement.requires.length > 0 &&
        achievementStatusMap &&
        allAchievements && (
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
        )}

      {/* Region details for region achievements */}
      {displayCriteria.regions && Array.isArray(displayCriteria.regions) && (
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
              <div className="mt-4" />
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
