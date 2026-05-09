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
import { Geography } from "./Geography";
import { Geographies } from "./Geographies";
import { useMapGeographyStyle } from "../hooks/useMapGeographyStyle";
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
  const { timelineMode } = useTimeline();

  // Home country for coloring
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

  return (
    <g style={isAddingMarker ? { pointerEvents: "none" } : undefined}>
      <Geographies geography={geographyData}>
        {({ geographies }: { geographies: GeographyFeature[] }) =>
          geographies.map((geo) => {
            const isoA2 = getCountryIsoCode(geo.properties);
            if (!isoA2) return null;

            // Get tooltip name: use country name from data if available, otherwise fallback to geo properties
            const tooltip =
              isoA2 && countryData?.countries
                ? getCountryName(isoA2, countryData.countries)
                : geo.properties.name;
            const interactiveMode = !isReadonly && !isEdit && !timelineMode;

            // Layer logic: blend all layers for this country
            const layers = layerGroups[isoA2] || [];
            const blendedFill = getBlendedLayerColor(
              layers,
              geographyStyle.default.fill,
            );

            // Determine if this country is highlighted, hovered, selected, home, visited, or upcoming
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

            // Determine final style based on priority: highlight > hover > home > visited > upcoming > blended > default
            let style = geographyStyle.default;
            if (isHighlighted) style = geographyStyle.highlight;
            else if (isHovered) style = geographyStyle.hover;
            else if (isHomeCountry)
              style = { ...geographyStyle.default, fill: HOME_COUNTRY_COLOR };
            else if (isUpcomingVisitCountry)
              style = {
                ...geographyStyle.default,
                fill: UPCOMING_VISIT_COUNTRY_COLOR,
              };
            else if (isVisitedCountry)
              style = {
                ...geographyStyle.default,
                fill: VISITED_COUNTRY_COLOR,
              };
            else if (blendedFill)
              style = { ...geographyStyle.default, fill: blendedFill };
            else if (isSelected) style = geographyStyle.hover;

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
                  default: style,
                  hover: style,
                  pressed: style,
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
