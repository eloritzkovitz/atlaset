import type { GeoProjection } from "d3-geo";
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
import { useMapColors, useMapSettings } from "@features/atlas/settings";
import { useMapTheme } from "@features/atlas/shared";
import { useTooltipTarget } from "@hooks";
import { isNumericString } from "@utils/string";
import { Geographies } from "./Geographies";
import { Geography } from "./Geography";
import { SmallCountryOverlay } from "./SmallCountryOverlay";
import { useAtlasColoring } from "../hooks/useAtlasColoring";
import { useMapLayerItems } from "../hooks/useMapLayerItems";
import type { GeoData, GeographyFeature } from "../types";
import { resolveCountryStyle } from "../utils/style";

const SMALL_COUNTRY_AREA_THRESHOLD = 10000;
const CIRCLE_RADIUS = 4;

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
  const { showSmallCountryOverlays } = useMapSettings();
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

  const highlightedSet = useMemo(
    () => new Set(highlightedIsoCodes),
    [highlightedIsoCodes],
  );

  // Create a lookup map for country areas to determine small countries
  const countryAreaMap = useMemo(() => {
    const lookup = new Map<string, number>();
    const countriesList = countryData?.countries || [];

    countriesList.forEach((c) => {
      if (c.isoCode) {
        lookup.set(c.isoCode.toUpperCase(), c.area || 0);
      }
    });

    return lookup;
  }, [countryData?.countries]);

  return (
    <>
      <Geographies
        geography={geographyData}
        style={isAddingMarker ? { pointerEvents: "none" } : undefined}
      >
        {({
          geographies,
          projection,
        }: {
          geographies: GeographyFeature[];
          projection: GeoProjection;
        }) => {
          const baseLayers: React.ReactNode[] = [];
          const overlayCircles: React.ReactNode[] = [];

          const upperSelected = selectedIsoCode?.toUpperCase();
          const upperHovered = hoveredIsoCode?.toUpperCase();

          geographies.forEach((geo) => {
            const isoA2 = getCountryIsoCode(geo.properties);
            if (!isoA2) return;

            const countryName = countryData?.countries
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

            // Determine the style for the country based on various states
            const finalStyle = resolveCountryStyle({
              geographyStyle,
              isHighlighted: highlightedSet.has(isoA2),
              isHovered: !!upperHovered && isoA2 === upperHovered,
              isSelected: !!upperSelected && isoA2 === upperSelected,
              isAtlasActive,
              atlasColor: atlasColorMap[isoA2],
              blendedFill,
            });

            // Register a virtual target for the tooltip and define shared event handlers
            const tooltipHandlers = registerVirtualTarget(String(tooltipValue));
            const sharedProps = {
              onMouseEnter: (e: React.MouseEvent<SVGPathElement>) => {
                tooltipHandlers.onMouseEnter(e);
                onCountryHover?.(isoA2);
              },
              onMouseMove: tooltipHandlers.onMouseMove,
              onMouseLeave: () => {
                clearTarget();
                onCountryHover?.(null);
              },
              onClick: () => onCountryClick?.(isoA2),
            };

            baseLayers.push(
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: finalStyle,
                  hover: finalStyle,
                  pressed: finalStyle,
                }}
                {...sharedProps}
              />,
            );

            // Determine if the country is small based on its area and whether to show overlays
            const countryArea = countryAreaMap.get(isoA2.toUpperCase()) || 0;
            const isSmallCountry =
              countryArea > 0 && countryArea < SMALL_COUNTRY_AREA_THRESHOLD;

            if (projection && isSmallCountry && showSmallCountryOverlays) {
              overlayCircles.push(
                <SmallCountryOverlay
                  key={`${geo.rsmKey}-overlay`}
                  geo={geo}
                  isoCode={isoA2}
                  geography={geographyData}
                  projection={projection}
                  circleRadius={CIRCLE_RADIUS}
                  style={finalStyle}
                  sharedProps={sharedProps}
                />,
              );
            }
          });

          return (
            <>
              {baseLayers}
              {overlayCircles}
            </>
          );
        }}
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
