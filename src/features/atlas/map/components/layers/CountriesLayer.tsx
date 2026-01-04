import type { Feature, Geometry } from "geojson";
import { useMemo } from "react";
import { Geographies, Geography } from "react-simple-maps";
import { getCountryIsoCode } from "@features/countries";
import {
  getBlendedLayerColor,
  groupLayerItemsByIsoCode,
  type LayerItem,
} from "@features/atlas/layers";
import { useCountryColors, useLayerColors } from "@features/settings";
import { useVisitedCountries } from "@features/visits/hooks/useVisitedCountries";
import { useHomeCountry } from "@features/user";
import { useMapGeographyStyle } from "../../hooks/useMapGeographyStyle";
import type { GeoData } from "../../types";

type MapCountriesLayerProps = {
  geographyData: GeoData;
  layerItems?: LayerItem[];
  selectedIsoCode?: string | null;
  hoveredIsoCode?: string | null;
  highlightedIsoCodes?: string[];
  onCountryClick?: (countryIsoCode: string) => void;
  onCountryHover?: (isoCode: string | null) => void;
  defaultColor?: string;
  isAddingMarker?: boolean;
};

export function CountriesLayer({
  geographyData,
  layerItems = [],
  selectedIsoCode,
  hoveredIsoCode,
  highlightedIsoCodes = [],
  onCountryClick,
  onCountryHover,
  isAddingMarker,
}: MapCountriesLayerProps) {
  const geographyStyle = useMapGeographyStyle(isAddingMarker);

  // Home country for coloring
  const { homeCountry } = useHomeCountry();
  const { colorHomeCountry, colorUpcomingVisits } = useLayerColors();
  const { HOME_COUNTRY_COLOR, UPCOMING_VISIT_COUNTRY_COLOR } =
    useCountryColors();
  const { upcomingCountryCodes } = useVisitedCountries();

  // Group layer items by isoCode for stacking/blending
  const layerGroups = useMemo(
    () => groupLayerItemsByIsoCode(layerItems),
    [layerItems]
  );

  return (
    <g style={isAddingMarker ? { pointerEvents: "none" } : undefined}>
      <Geographies geography={geographyData}>
        {({
          geographies,
        }: {
          geographies: Feature<Geometry, { [key: string]: unknown }>[];
        }) =>
          geographies.map((geo) => {
            const isoA2 = getCountryIsoCode(geo.properties);
            if (!isoA2) return null;

            // Home country coloring logic
            const isHomeCountry =
              colorHomeCountry &&
              homeCountry &&
              isoA2 === homeCountry.toUpperCase();

            // Upcoming visit coloring logic
            const isUpcomingVisitCountry =
              colorUpcomingVisits && upcomingCountryCodes.includes(isoA2);

            // Coloring logic
            const isHighlighted = highlightedIsoCodes.includes(isoA2);
            const isSelected =
              !!selectedIsoCode && isoA2 === selectedIsoCode.toUpperCase();
            const isHovered =
              !!hoveredIsoCode && isoA2 === hoveredIsoCode.toUpperCase();

            // Layer logic: blend all layers for this country
            const layers = layerGroups[isoA2] || [];
            const blendedFill = getBlendedLayerColor(
              layers,
              geographyStyle.default.fill
            );

            // Style: highlight takes precedence, then blended layers, then base
            let style = geographyStyle.default;
            const tooltip = geo.properties.name;

            if (isHighlighted) {
              style = geographyStyle.highlight;
            } else if (isHovered) {
              style = geographyStyle.hover;
            } else if (isHomeCountry) {
              style = { ...geographyStyle.default, fill: HOME_COUNTRY_COLOR };
            } else if (isUpcomingVisitCountry) {
              style = {
                ...geographyStyle.default,
                fill: UPCOMING_VISIT_COUNTRY_COLOR,
              };
            } else if (blendedFill) {
              style = { ...geographyStyle.default, fill: blendedFill };
            } else if (isSelected) {
              style = geographyStyle.hover;
            }

            return (
              <Geography
                key={(geo as unknown as { rsmKey: string }).rsmKey}
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
