import { useMemo } from "react";
import { Tooltip } from "@components";
import { useMapView } from "@contexts/MapViewContext";
import {
  getCountryIsoCode,
  getCountryName,
  useCountryData,
} from "@features/countries";
import {
  getBlendedLayerColor,
  groupLayerItemsByIsoCode,
} from "@features/atlas/layers";
import { useMapColors } from "@features/atlas/settings";
import { useTooltipTarget } from "@hooks";
import { isNumericString } from "@utils/string";
import { Geography } from "./Geography";
import { Geographies } from "./Geographies";
import { useAtlasColoring } from "../hooks/useAtlasColoring";
import { useMapTheme } from "@features/atlas/shared";
import { useMapLayerItems } from "../hooks/useMapLayerItems";
import type { GeoData, GeographyFeature } from "../types";

interface LayersContainerProps {
  geographyData: GeoData;
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
  selectedIsoCode,
  hoveredIsoCode,
  highlightedIsoCodes = [],
  onCountryClick,
  onCountryHover,
  isAddingMarker,
}: LayersContainerProps) {
  const countryData = useCountryData();
  const { numAtlasColors } = useMapColors();
  const { geographyStyle } = useMapTheme();
  const { mapMode, isAtlasActive } = useMapView();
  const { activeTarget, registerVirtualTarget, clearTarget } =
    useTooltipTarget();

  const layerItems = useMapLayerItems(mapMode);
  const layerGroups = useMemo(
    () => groupLayerItemsByIsoCode(layerItems),
    [layerItems],
  );

  const { map: atlasColorMap } = useAtlasColoring(geographyData, {
    colors: numAtlasColors,
    enabled: isAtlasActive,
  });

  return (
    <>
      <Geographies
        geography={geographyData}
        style={isAddingMarker ? { pointerEvents: "none" } : undefined}
      >
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

            const tooltipValue =
              !countryName || isIsoNumeric || countryNameIsIso
                ? geo.properties?.name || isoA2 || ""
                : countryName;

            const layers = layerGroups[isoA2] || [];
            const blendedFill = getBlendedLayerColor(
              layers,
              geographyStyle.default.fill,
            );

            const isHighlighted = highlightedIsoCodes.includes(isoA2);
            const isSelected =
              !!selectedIsoCode && isoA2 === selectedIsoCode.toUpperCase();
            const isHovered =
              !!hoveredIsoCode && isoA2 === hoveredIsoCode.toUpperCase();

            let fill = geographyStyle.default.fill;

            if (isHighlighted) {
              fill = geographyStyle.highlight.fill;
            } else if (isHovered || isSelected) {
              fill = geographyStyle.hover.fill;
            } else if (isAtlasActive) {
              fill = atlasColorMap[isoA2] || geographyStyle.default.fill;
            } else if (blendedFill) {
              fill = blendedFill;
            }

            const finalStyle = { ...geographyStyle.default, fill };

            const tooltipHandlers = registerVirtualTarget(String(tooltipValue));

            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onMouseEnter={(e) => {
                  tooltipHandlers.onMouseEnter(e);
                  onCountryHover?.(isoA2 ?? null);
                }}
                onMouseMove={(e) => {
                  tooltipHandlers.onMouseMove(e);
                }}
                onMouseLeave={() => {
                  clearTarget();
                  onCountryHover?.(null);
                }}
                onClick={() => isoA2 && onCountryClick?.(isoA2)}
                style={{
                  default: finalStyle,
                  hover: finalStyle,
                  pressed: finalStyle,
                }}
              />
            );
          })
        }
      </Geographies>

      {activeTarget && activeTarget.virtualCoords && (
        <Tooltip
          overrideCoords={activeTarget.virtualCoords}
          content={activeTarget.id}
        />
      )}
    </>
  );
}
