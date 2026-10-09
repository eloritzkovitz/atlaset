import { useTranslation } from "react-i18next";
import { Card, ProgressBar } from "@components";
import { RegionIcon } from "@features/countries";
import { useAccessibility } from "@features/settings/accessibility";
import { useAnimatedNumber } from "@hooks";
import { formatFraction } from "@utils";
import { RegionButton } from "./RegionButton";
import { SubregionProgressRow } from "./SubregionProgressRow";
import type { SubregionStat } from "../types";
import { translateRegionLabel } from "../../core/utils/regionTranslation";
import {
  getRegionProgressBarClass,
  getRegionProgressIconClass,
} from "../utils/regionProgressColors";

interface RegionCardProps {
  region: string;
  visited: number;
  total: number;
  subregions: SubregionStat[];
  loading?: boolean;
  onRegionClick: () => void;
  onSubregionClick?: (subregion: string) => void;
}

/** Renders a region card. */
export function RegionCard({
  region,
  visited,
  total,
  subregions,
  loading = false,
  onRegionClick,
  onSubregionClick,
}: RegionCardProps) {
  const { animationsEnabled } = useAccessibility();

  const animatedVisited = useAnimatedNumber(animationsEnabled, visited, 640);

  const { t: tCountries } = useTranslation("countries");
  const { t: tExplore } = useTranslation("explore");

  const regionLabel = translateRegionLabel(region, tCountries, tExplore);

  const progressColor = getRegionProgressBarClass(region);
  const iconColor = getRegionProgressIconClass(region);

  return (
    <Card loading={loading} skeletonLines={6}>
      {!loading && (
        <>
          <RegionButton
            icon={<RegionIcon region={region} />}
            iconClassName={iconColor}
            label={regionLabel}
            stats={formatFraction(animatedVisited, total, {
              showPercent: true,
            })}
            onClick={onRegionClick}
            className="mb-2 text-2xl"
            labelClassName="text-2xl text-text"
            statsClassName="text-xl text-muted"
          />

          <ProgressBar
            value={animatedVisited}
            max={total}
            label={regionLabel}
            size="md"
            colorClassName={progressColor}
            className="mb-3"
            animated={animationsEnabled}
          />

          <div className="ms-2">
            {subregions.map((subregion) => (
              <SubregionProgressRow
                key={subregion.subregion}
                region={region}
                subregion={subregion}
                onClick={() => onSubregionClick?.(subregion.subregion)}
              />
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
