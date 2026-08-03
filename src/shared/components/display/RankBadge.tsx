import { FaMedal } from "react-icons/fa6";
import { formatRank } from "@utils";

const MEDAL_COLORS: Record<number, string> = {
  1: "text-yellow-400",
  2: "text-slate-300",
  3: "text-amber-600",
};

interface RankBadgeProps {
  rank: number;
  showPaddingWhenNoMedal?: boolean;
}

/** Renders a badge displaying a user's rank, optionally with a medal icon. */
export function RankBadge({
  rank,
  showPaddingWhenNoMedal = false,
}: RankBadgeProps) {
  const medalColor = MEDAL_COLORS[rank];

  return (
    <div
      className={`flex items-center gap-1.5 text-xs font-semibold ${
        medalColor
          ? `font-bold ${medalColor}`
          : `text-muted ${showPaddingWhenNoMedal ? "pl-5.5" : ""}`
      }`}
    >
      {medalColor && <FaMedal className="w-4 h-4 drop-shadow-sm shrink-0" />}
      <span>{formatRank(rank)}</span>
    </div>
  );
}
