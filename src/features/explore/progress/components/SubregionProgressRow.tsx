import { useTranslation } from "react-i18next";
import { ProgressBar } from "@components";
import { useCountryData } from "@features/countries";
import { useAccessibility } from "@features/settings/accessibility";
import { useAnimatedNumber } from "@hooks";
import { formatFraction } from "@utils";
import { RegionButton } from "./RegionButton";
import type { SubregionStat } from "../types";
import { translateSubregionLabel } from "../../core/utils/regionTranslation";
import { getRegionProgressBarClass } from "../utils/regionProgressColors";

interface SubregionProgressRowProps {
  region: string;
  subregion: SubregionStat;
  onClick: () => void;
}

/** Renders a subregion progress row. */
export function SubregionProgressRow({
  region,
  subregion,
  onClick,
}: SubregionProgressRowProps) {
  const { animationsEnabled } = useAccessibility();
  const { subregionToRegion } = useCountryData();
  const { t } = useTranslation("countries");

  const animatedVisited = useAnimatedNumber(
    animationsEnabled,
    subregion.subregionVisited,
    640,
  );

  const label = translateSubregionLabel(
    subregion.subregion,
    subregionToRegion,
    undefined,
    t,
  );

  const total = subregion.subregionCountries.length;
  const progressBarColor = getRegionProgressBarClass(region);

  return (
    <div className="mb-2 last:mb-0">
      <RegionButton
        label={label}
        stats={formatFraction(animatedVisited, total, {
          showPercent: true,
        })}
        onClick={onClick}
        className="px-2 py-1 text-base"
        labelClassName="text-text"
        statsClassName="text-muted"
      />

      <div className="mx-2 mt-1">
        <ProgressBar
          value={animatedVisited}
          max={total}
          label={label}
          size="sm"
          colorClassName={progressBarColor}
          animated={animationsEnabled}
        />
      </div>
    </div>
  );
}
