import React from "react";
import { Chip } from "@components";

interface AchievementTierChipProps {
  tier: number;
  totalTiers?: number;
  className?: string;
}

export const AchievementTierChip: React.FC<AchievementTierChipProps> = ({
  tier,
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
  return <Chip className={className || colorClass}>{label}</Chip>;
};
