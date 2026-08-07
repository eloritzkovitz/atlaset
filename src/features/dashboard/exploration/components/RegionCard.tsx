import { useTranslation } from "react-i18next";
import { Card } from "@components";
import { RegionIcon } from "@features/countries";
import { useAnimatedNumber } from "@hooks";
import { formatFraction } from "@utils";
import { RegionButton } from "./RegionButton";
import { SubregionStatsRow } from "./SubregionStatsRow";
import type { SubregionStat } from "../types";
import { translateRegionLabel } from "../../core/utils/regionTranslation";

interface RegionCardProps {
  region: string;
  visited: number;
  total: number;
  subregions: SubregionStat[];
  loading?: boolean;
  onRegionClick?: () => void;
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
  const animatedVisited = useAnimatedNumber(visited, 640);
  const { t: tCountries } = useTranslation("countries");
  const { t: tDashboard } = useTranslation("dashboard");

  return (
    <Card loading={loading} skeletonLines={6}>
      {!loading && (
        <>
          <RegionButton
            icon={<RegionIcon region={region} />}
            label={translateRegionLabel(region, tCountries, tDashboard)}
            stats={formatFraction(animatedVisited, total, {
              showPercent: true,
            })}
            onClick={onRegionClick}
            className="mb-2 text-2xl"
            labelClassName="text-2xl"
            statsClassName="text-xl"
          />
          <div className="ms-2">
            {subregions.map((subregion) => (
              <SubregionStatsRow
                key={subregion.subregion}
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
