import { useMemo } from "react";
import { useMapView } from "@contexts/MapViewContext";
import { useTimeline } from "@contexts/TimelineContext";
import {
  getCountryIsoCode,
  getCountryName,
  useCountryData,
} from "@features/countries";
import {
  getBlendedLayerColor,
  groupLayerItemsByIsoCode,
  type LayerItem,
} from "@features/atlas/layers";
import { useCountryColors, useLayerColors } from "@features/settings";
import { useVisitedCountries } from "@features/visits/hooks/useVisitedCountries";
import { useHomeCountry } from "@features/user";
import { isNumericString } from "@utils/string";
import { Geography } from "./Geography";
import { Geographies } from "./Geographies";
import { useMapGeographyStyle } from "../hooks/useMapGeographyStyle";
import { useAtlasColoring } from "../hooks/useAtlasColoring";
import type { GeoData, GeographyFeature } from "../types";

interface LayersContainerProps {
  geographyData: GeoData;
  layerItems?: LayerItem[];
  selectedIsoCode?: string | null;
  hoveredIsoCode?: string | null;
  highlightedIsoCodes?: string[];
  onCountryClick?: (countryIsoCode: string) => void;
  onCountryHover?: (isoCode: string | null) => void;
  defaultColor?: string;
  isAddingMarker?: boolean;
}

export function LayersContainer({
  geographyData,
  layerItems = [],
  selectedIsoCode,
  hoveredIsoCode,
  highlightedIsoCodes = [],
  onCountryClick,
  onCountryHover,
  isAddingMarker,
}: LayersContainerProps) {
  const geographyStyle = useMapGeographyStyle(isAddingMarker);
  const countryData = useCountryData();
  const { isEdit, isReadonly } = useMapView();
  const { timelineMode, colorMode } = useTimeline();

  const { homeCountry } = useHomeCountry();
  const { colorHomeCountry, colorVisitedCountries, colorUpcomingVisits } =
    useLayerColors();
  const {
    HOME_COUNTRY_COLOR,
    VISITED_COUNTRY_COLOR,
    UPCOMING_VISIT_COUNTRY_COLOR,
  } = useCountryColors();
  const { visitedCountryCodes, upcomingCountryCodes } = useVisitedCountries();

  const visitedSet = useMemo(
    () => new Set((visitedCountryCodes || []).map((s) => s.toUpperCase())),
    [visitedCountryCodes],
  );
  const upcomingSet = useMemo(
    () => new Set((upcomingCountryCodes || []).map((s) => s.toUpperCase())),
    [upcomingCountryCodes],
  );

  // Group layer items by isoCode for stacking/blending
  const layerGroups = useMemo(
    () => groupLayerItemsByIsoCode(layerItems),
    [layerItems],
  );

  // Atlas coloring
  const isAtlasActive = colorMode === "atlas";
  const { map: atlasColorMap } = useAtlasColoring(geographyData, {
    enabled: isAtlasActive,
  });

  return (
    <g style={isAddingMarker ? { pointerEvents: "none" } : undefined}>
      <Geographies geography={geographyData}>
        {({ geographies }: { geographies: GeographyFeature[] }) =>
          geographies.map((geo) => {
            const isoA2 = getCountryIsoCode(geo.properties);
            if (!isoA2) return null;

            const countryName =
              isoA2 && countryData?.countries
                ? getCountryName(isoA2, countryData.countries)
                : undefined;
            const isIsoNumeric = isNumericString(isoA2);
            const countryNameIsIso =
              !!(countryName && isoA2) &&
              countryName.toUpperCase() === isoA2.toUpperCase();

            const tooltip =
              !countryName || isIsoNumeric || countryNameIsIso
                ? geo.properties?.name || isoA2 || ""
                : countryName;

            const interactiveMode = !isReadonly && !isEdit && !timelineMode;

            const layers = layerGroups[isoA2] || [];
            const blendedFill = getBlendedLayerColor(
              layers,
              geographyStyle.default.fill,
            );

            // Determine country state for styling
            const isHighlighted = highlightedIsoCodes.includes(isoA2);
            const isSelected =
              !!selectedIsoCode && isoA2 === selectedIsoCode.toUpperCase();
            const isHovered =
              !!hoveredIsoCode && isoA2 === hoveredIsoCode.toUpperCase();
            const isHomeCountry =
              interactiveMode &&
              colorHomeCountry &&
              homeCountry &&
              isoA2 === homeCountry.toUpperCase();
            const isVisitedCountry =
              interactiveMode && colorVisitedCountries && visitedSet.has(isoA2);
            const isUpcomingVisitCountry =
              interactiveMode && colorUpcomingVisits && upcomingSet.has(isoA2);

            // Determine final style based on priority
            let fill = geographyStyle.default.fill;

            if (isHighlighted) {
              fill = geographyStyle.highlight.fill;
            } else if (isHovered || isSelected) {
              fill = geographyStyle.hover.fill;
            } else if (isAtlasActive) {
              fill = atlasColorMap[isoA2] || geographyStyle.default.fill;
            } else {
              if (isHomeCountry) fill = HOME_COUNTRY_COLOR;
              else if (isUpcomingVisitCountry)
                fill = UPCOMING_VISIT_COUNTRY_COLOR;
              else if (isVisitedCountry) fill = VISITED_COUNTRY_COLOR;
              else if (blendedFill) fill = blendedFill;
            }

            const finalStyle = { ...geographyStyle.default, fill };

            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onMouseEnter={() =>
                  onCountryHover && onCountryHover(isoA2 ?? null)
                }
                onMouseLeave={() => onCountryHover && onCountryHover(null)}
                onClick={() => onCountryClick && isoA2 && onCountryClick(isoA2)}
                style={{
                  default: finalStyle,
                  hover: finalStyle,
                  pressed: finalStyle,
                }}
              >
                <title>{String(tooltip)}</title>
              </Geography>
            );
          })
        }
      </Geographies>
    </g>
  );
}
