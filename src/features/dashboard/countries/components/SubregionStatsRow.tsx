import { useAnimatedNumber } from "@hooks";
import { percent } from "@utils/number";
import { RegionButton } from "./RegionButton";
import type { SubregionStat } from "../../types";

interface SubregionStatsRowProps {
  sub: SubregionStat;
  onClick?: () => void;
}

export function SubregionStatsRow({ sub, onClick }: SubregionStatsRowProps) {
  const animatedVisited = useAnimatedNumber(sub.visited, 640);
  return (
    <RegionButton
      key={sub.name}
      label={sub.name}
      stats={`${animatedVisited}/${sub.total} (${percent(
        animatedVisited,
        sub.total
      )})`}
      onClick={onClick}
      className="text-base py-1 px-2"
      labelClassName="text-text"
      statsClassName="text-muted"
    />
  );
}
