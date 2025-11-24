import { useSettings } from "@contexts/SettingsContext";
import { COLOR_PALETTES, HOME_COUNTRY_COLOR } from "@constants/colors";

export function useCountryColors() {
  const { settings } = useSettings();
  const selectedPaletteName = settings.overlayPalettes?.standard || COLOR_PALETTES[0].name;
  const selectedPalette = COLOR_PALETTES.find(p => p.name === selectedPaletteName) || COLOR_PALETTES[0];

  return {
    HOME_COUNTRY_COLOR: HOME_COUNTRY_COLOR,
    HOVERED_COUNTRY_COLOR: selectedPalette.colors[0],
    VISITED_COUNTRY_COLOR: selectedPalette.colors[1],
    SELECTED_COUNTRY_COLOR: selectedPalette.colors[2],
    UPCOMING_VISIT_COUNTRY_COLOR: selectedPalette.colors[3],
  };
}
