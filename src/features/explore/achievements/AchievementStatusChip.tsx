import React from "react";
import { Chip } from "@components";
import type { AchievementStatus } from "@features/achievements/types";

interface AchievementStatusChipProps {
  status: AchievementStatus;
  className?: string;
}

const statusLabels: Record<AchievementStatus, string> = {
  completed: "Completed",
  progress: "In Progress",
  locked: "Locked",
};

const statusChipClasses: Record<AchievementStatus, string> = {
  completed: "bg-success/50",
  progress: "bg-info/70",
  locked: "bg-muted/20 text-muted",
};

export const AchievementStatusChip: React.FC<AchievementStatusChipProps> = ({
  status,
  className,
}) => (
  <Chip className={className || statusChipClasses[status]}>
    {statusLabels[status]}
  </Chip>
);
