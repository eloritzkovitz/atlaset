import type { Feature, Geometry } from "geojson";
import { useMemo } from "react";
import { Geographies, Geography } from "react-simple-maps";
import { getCountryIsoCode } from "@features/countries";
import { useMapGeographyStyle } from "@features/atlas/map/hooks/useMapGeographyStyle";
import {
  getBlendedOverlayColor,
  groupOverlayItemsByIsoCode,
} from "@features/atlas/overlays";
import {
  useCountryColors,
  useHomeCountry,
  useOverlayColors,
} from "@features/settings";
import type { OverlayItem } from "@types";
import type { GeoData } from "../../types";

type MapCountriesLayerProps = {
  geographyData: GeoData;
  overlayItems?: OverlayItem[];
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
  overlayItems = [],
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
  const { colorHomeCountry } = useOverlayColors();
  const { HOME_COUNTRY_COLOR } = useCountryColors();

  // Group overlay items by isoCode for stacking/blending
  const overlayGroups = useMemo(
    () => groupOverlayItemsByIsoCode(overlayItems),
    [overlayItems]
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

            // Coloring logic
            const isHighlighted = highlightedIsoCodes.includes(isoA2);
            const isSelected =
              !!selectedIsoCode && isoA2 === selectedIsoCode.toUpperCase();
            const isHovered =
              !!hoveredIsoCode && isoA2 === hoveredIsoCode.toUpperCase();

            // Overlay logic: blend all overlays for this country
            const overlays = overlayGroups[isoA2] || [];
            const blendedFill = getBlendedOverlayColor(
              overlays,
              geographyStyle.default.fill
            );

            // Style: highlight takes precedence, then blended overlays, then base
            let style = geographyStyle.default;
            const tooltip = geo.properties.name;

            if (isHighlighted) {
              style = geographyStyle.highlight;
            } else if (isHovered) {
              style = geographyStyle.hover;
            } else if (isHomeCountry) {
              style = { ...geographyStyle.default, fill: HOME_COUNTRY_COLOR };
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
