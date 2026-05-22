import { useMapView } from "@contexts/MapViewContext";
import { MAP_GEOGRAPHY_STYLE, useCountryColors } from "@features/settings";

/**
 * Returns map geography styles based on UI settings and marker mode.
 * @param isAddingMarker - Boolean indicating if a marker is being added.
 * @returns Object containing styles for default, hover, and pressed states.
 */
export function useMapGeographyStyle(isAddingMarker?: boolean) {
  const { borderColor, borderWidth } = useMapView();
  const {
    HIGHLIGHTED_COUNTRY_COLOR,
    HOVERED_COUNTRY_COLOR,
    SELECTED_COUNTRY_COLOR,
  } = useCountryColors();
  const cursor = isAddingMarker ? "crosshair" : "pointer";
  const base = {
    ...MAP_GEOGRAPHY_STYLE.default,
    stroke: borderColor,
    strokeWidth: borderWidth,
    cursor,
  };

  return {
    default: base,
    highlight: { ...base, fill: HIGHLIGHTED_COUNTRY_COLOR },
    hover: { ...base, fill: HOVERED_COUNTRY_COLOR },
    pressed: { ...base, fill: SELECTED_COUNTRY_COLOR },
  };
}
