import { useTranslation } from "react-i18next";
import { useCountryData } from "@features/countries";
import { useAnimatedNumber } from "@hooks";
import { formatFraction } from "@utils";
import { RegionButton } from "./RegionButton";
import type { SubregionStat } from "../types";
import { translateSubregionLabel } from "../../core/utils/regionTranslation";

interface SubregionStatsRowProps {
  subregion: SubregionStat;
  onClick?: () => void;
}

/** Renders a subregion stats row. */
export function SubregionStatsRow({
  subregion,
  onClick,
}: SubregionStatsRowProps) {
  const animatedVisited = useAnimatedNumber(subregion.subregionVisited, 640);
  const { t } = useTranslation("countries");
  const { subregionToRegion } = useCountryData();
  const label = translateSubregionLabel(
    subregion.subregion,
    subregionToRegion,
    undefined,
    t,
  );

  return (
    <RegionButton
      key={subregion.subregion}
      label={label}
      stats={formatFraction(
        animatedVisited,
        subregion.subregionCountries.length,
        { showPercent: true },
      )}
      onClick={onClick}
      className="text-base py-1 px-2"
      labelClassName="text-text"
      statsClassName="text-muted"
    />
  );
}
