import { MAP_STYLE_CONFIG } from "@constants";
import { useMapUI } from "@contexts/MapUIContext";
import { useCountryColors } from "@features/settings/hooks/useCountryColors";

export function useMapGeographyStyle(isAddingMarker?: boolean) {
  const { borderColor, borderWidth } = useMapUI();  
  const { HOVERED_COUNTRY_COLOR, SELECTED_COUNTRY_COLOR } = useCountryColors(); 
  const cursor = isAddingMarker ? "crosshair" : "pointer";

  return {
    default: {
      ...MAP_STYLE_CONFIG.default,
      stroke: borderColor,
      strokeWidth: borderWidth,
      cursor,
    },
    hover: {
      ...MAP_STYLE_CONFIG.default,
      fill: HOVERED_COUNTRY_COLOR,
      stroke: borderColor,
      strokeWidth: borderWidth,
      cursor,
    },
    pressed: {
      ...MAP_STYLE_CONFIG.default,
      fill: SELECTED_COUNTRY_COLOR,
      stroke: borderColor,
      strokeWidth: borderWidth,
      cursor,
    },
  };
}
