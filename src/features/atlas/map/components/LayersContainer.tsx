import type { GeoProjection } from "d3-geo";
import { useCallback, useMemo } from "react";
import { Tooltip } from "@components";
import { useMapView } from "@contexts/MapViewContext";
import {
  getBlendedLayerColor,
  groupLayerItemsByIsoCode,
} from "@features/atlas/layers";
import { useMapColors, useMapOverlays } from "@features/atlas/settings";
import { useMapTheme } from "@features/atlas/shared";
import {
  getCountryIsoCode,
  getCountryName,
  useCountryData,
} from "@features/countries";
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
  const { countries, integralRegionsLookup, sovereignLookup, countryAreaMap } =
    useCountryData();
  const { numAtlasColors } = useMapColors();
  const { showSmallCountryOverlays, includeIntegralRegions } = useMapOverlays();
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

  // Expand an ISO code to include its parent and integral regions if applicable
  const expandIsoCode = useCallback(
    (isoCode: string, includeParent = false): Set<string> => {
      const set = new Set<string>();
      const upper = isoCode.toUpperCase();
      const parentIso = includeParent
        ? sovereignLookup.get(upper) || upper
        : upper;

      set.add(parentIso);

      // Only include overseas/integral regions if the setting is enabled
      if (includeIntegralRegions) {
        integralRegionsLookup
          .get(parentIso)
          ?.forEach((region) => set.add(region));
      }

      return set;
    },
    [sovereignLookup, integralRegionsLookup, includeIntegralRegions],
  );

  const highlightedSet = useMemo(() => {
    const set = new Set<string>();
    highlightedIsoCodes.forEach((code) => {
      expandIsoCode(code).forEach((c) => set.add(c));
    });
    return set;
  }, [highlightedIsoCodes, expandIsoCode]);

  const hoveredSet = useMemo(
    () =>
      hoveredIsoCode ? expandIsoCode(hoveredIsoCode, true) : new Set<string>(),
    [hoveredIsoCode, expandIsoCode],
  );

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

          geographies.forEach((geo) => {
            const isoA2 = getCountryIsoCode(geo.properties);
            if (!isoA2) return;

            const upperIsoA2 = isoA2.toUpperCase();
            const countryName = getCountryName(isoA2, countries);
            const isIsoName = countryName.toUpperCase() === upperIsoA2;
            const tooltipValue =
              isNumericString(isoA2) || isIsoName
                ? geo.properties?.name || isoA2
                : countryName;

            const layers = layerGroups[isoA2] || [];
            const blendedFill = getBlendedLayerColor(
              layers,
              geographyStyle.default.fill,
            );

            // Determine the style for the country based on various states
            const finalStyle = resolveCountryStyle({
              geographyStyle,
              isHighlighted: highlightedSet.has(upperIsoA2),
              isHovered: hoveredSet.has(upperIsoA2),
              isSelected: !!upperSelected && upperIsoA2 === upperSelected,
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
                data-export-title={tooltipValue}
              />,
            );

            // Determine if the country is small based on its area and whether to show overlays
            const countryArea = countryAreaMap.get(upperIsoA2) || 0;
            const isSmallCountry =
              countryArea > 0 && countryArea < SMALL_COUNTRY_AREA_THRESHOLD;

            if (projection && isSmallCountry && showSmallCountryOverlays) {
              overlayCircles.push(
                <SmallCountryOverlay
                  key={`${geo.rsmKey}-overlay`}
                  geo={geo}
                  isoCode={isoA2}
                  tooltip={tooltipValue as string}
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

      {activeTarget?.virtualCoords && (
        <Tooltip
          overrideCoords={activeTarget.virtualCoords}
          content={activeTarget.id}
        />
      )}
    </>
  );
}
