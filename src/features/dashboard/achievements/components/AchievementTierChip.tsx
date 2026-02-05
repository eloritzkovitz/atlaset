import React from "react";
import { Chip, Tooltip } from "@components";

interface AchievementTierChipProps {
  tier: number;
  totalTiers?: number;
  className?: string;
  tiers?: Array<{ tier: number; count?: number; description?: string }>;
}

export const AchievementTierChip: React.FC<AchievementTierChipProps> = ({
  tier,
  tiers,
  totalTiers,
  className,
}) => {
  const label = totalTiers ? `Tier ${tier}/${totalTiers}` : `Tier ${tier}`;
  const tierBgClasses: Record<number, string> = {
    1: "bg-amber-600/30",
    2: "bg-gray-300/30",
    3: "bg-yellow-300/30",
    4: "bg-slate-200/30",
    5: "bg-cyan-200/30",
    6: "bg-purple-200/30",
  };
  const colorClass =
    tierBgClasses[tier] || tierBgClasses[6] || "bg-surface text-primary";

  // Tooltip content for stacked tiers
  let tooltipContent: string | undefined;
  if (tiers && tiers.length > 1) {
    tooltipContent = tiers
      .map((t) => {
        let countText = t.count !== undefined ? t.count : undefined;
        return `Tier ${t.tier}${countText !== undefined ? ` - ${countText}` : t.description ? ` - ${t.description}` : ""}`;
      })
      .join("\n");
  }

  const chip = <Chip className={className || colorClass}>{label}</Chip>;
  return tooltipContent ? (
    <Tooltip content={tooltipContent}>{chip}</Tooltip>
  ) : (
    chip
  );
};
