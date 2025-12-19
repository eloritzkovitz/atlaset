import { useSettings } from "@contexts/SettingsContext";

/**
 * Manages home country settings.
 * @returns Home country, setter, color flag, and its setter.
 */
export function useHomeCountry() {
  const { settings, updateSettings } = useSettings();

  const setHomeCountry = (country: string) =>
    updateSettings({ homeCountry: country });

  // Fallback to false if overlays or colorHomeCountry is undefined
  const colorHomeCountry = !!settings?.overlays?.colorHomeCountry;
  const setColorHomeCountry = (value: boolean) =>
    updateSettings({
      overlays: { ...(settings.overlays ?? {}), colorHomeCountry: value },
    });

  return {
    homeCountry: settings?.homeCountry,
    setHomeCountry,
    colorHomeCountry,
    setColorHomeCountry,
  };
}
