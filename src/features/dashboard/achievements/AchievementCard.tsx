import { useMemo } from "react";
import { Checklist } from "@components";
import {
  getDisplayFlagCountries,
  getProgress,
  getTier,
  getCurrentTier,
  type Achievement,
  type AchievementStatus,
} from "@features/achievements";
import { CountryFlagGrid, type Country } from "@features/countries";
import type { Trip } from "@features/trips/types";
import { AchievementIcon } from "./AchievementIcon";
import { AchievementProgressChip } from "./AchievementProgressChip";
import { AchievementStatusChip } from "./AchievementStatusChip";
import { AchievementTierChip } from "./AchievementTierChip";

interface AchievementCardProps {
  achievement: Achievement;
  countries: Country[];
  isVisitedCountry: (iso: string) => boolean;
  trips?: Trip[];
  homeCountry?: string;
  achievementStatusMap?: Record<string, boolean>;
  allAchievements?: Achievement[];
  onClick?: () => void;
}

const STATUS_BG_CLASSES: Record<AchievementStatus, string> = {
  locked: "bg-surface-alt/30 text-muted",
  progress: "bg-surface-alt",
  completed: "bg-success/20",
};

export function AchievementCard({
  achievement,
  countries,
  isVisitedCountry,
  trips,
  homeCountry,
  achievementStatusMap,
  allAchievements,
  onClick,
}: AchievementCardProps) {
  // Tier metadata
  const { tierObj, tierStatus, tierCount } = getCurrentTier(
    achievement,
    countries,
    isVisitedCountry,
    trips,
    homeCountry,
  );

  // Derived display values
  const displayName = tierObj?.name || achievement.name;
  const displayDescription = tierObj?.description || achievement.description;
  const displayTier = tierObj?.tier || getTier(achievement);

  const displayCriteria = useMemo(() => {
    if (typeof tierCount === "number" && achievement.countries) {
      return { countries: achievement.countries.slice(0, tierCount) };
    }
    return tierObj?.criteria || achievement.criteria || {};
  }, [
    achievement.countries,
    achievement.criteria,
    tierCount,
    tierObj?.criteria,
  ]);

  const progressLabel = getProgress(
    { ...achievement, criteria: displayCriteria },
    countries,
    isVisitedCountry,
    trips,
    homeCountry,
    achievementStatusMap,
  );

  const flagCountries = useMemo(
    () =>
      getDisplayFlagCountries(
        achievement,
        displayCriteria,
        countries,
        tierCount,
      ),
    [achievement, displayCriteria, countries, tierCount],
  );

  const requirementChecklist = useMemo(() => {
    if (
      !achievement.requires?.length ||
      !achievementStatusMap ||
      !allAchievements
    ) {
      return null;
    }
    return achievement.requires.map((reqId) => {
      const completed = achievementStatusMap[reqId] || false;
      const reqAchievement = allAchievements.find((a) => a.id === reqId);
      return { label: reqAchievement?.name || reqId, completed };
    });
  }, [achievement.requires, achievementStatusMap, allAchievements]);

  const regionChecklist = useMemo(() => {
    if (!displayCriteria.regions || !Array.isArray(displayCriteria.regions)) {
      return null;
    }
    return displayCriteria.regions.map((region: string) => {
      const visitedAny = countries.some(
        (c) => c.region === region && isVisitedCountry(c.isoCode),
      );
      return { label: region, completed: visitedAny };
    });
  }, [displayCriteria.regions, countries, isVisitedCountry]);

  const mappedTiers = useMemo(() => {
    if (!achievement.tiers) return undefined;
    return achievement.tiers.map((t, idx) => ({
      tier: t.tier ?? idx + 1,
      count: t.criteria?.required ?? t.count,
      description: t.description,
    }));
  }, [achievement.tiers]);

  const statusClass = STATUS_BG_CLASSES[tierStatus as AchievementStatus] || "";
  const showTierChip = Boolean(
    displayTier && achievement.tiers && achievement.tiers.length > 0,
  );

  return (
    <div
      className={`rounded-xl p-5 flex flex-col items-center transition-shadow duration-200 shadow-sm hover:scale-105 hover:bg-primary/20 select-none ${statusClass}`}
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
            tier={displayTier ?? 1}
            totalTiers={achievement.tiers?.length}
            tiers={mappedTiers}
          />
        )}
        <AchievementProgressChip label={progressLabel} className="bg-surface" />
        <AchievementStatusChip status={tierStatus} />
      </div>

      {requirementChecklist && <Checklist items={requirementChecklist} />}
      {regionChecklist && <Checklist items={regionChecklist} />}
      {flagCountries.length > 0 && (
        <>
          <div className="mt-4" />
          <CountryFlagGrid
            countryCodes={flagCountries.map((c) => c.isoCode)}
            size="32"
            isHighlighted={(isoCode) => isVisitedCountry(isoCode)}
          />
        </>
      )}
    </div>
  );
}
