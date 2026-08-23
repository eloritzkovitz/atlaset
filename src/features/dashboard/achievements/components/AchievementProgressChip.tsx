import { Chip } from "@components";
import { formatProgressChip } from "../utils/achievementDisplay";

interface AchievementProgressChipProps {
  label: string;
  className?: string;
}

export function AchievementProgressChip({
  label,
  className,
}: AchievementProgressChipProps) {
  const formatted = formatProgressChip(label);
  if (!formatted) return null;
  return <Chip className={className}>{formatted}</Chip>;
}
