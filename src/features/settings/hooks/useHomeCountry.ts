import { useSettings } from "@contexts/SettingsContext";

/**
 * Manages home country settings.
 * @returns Home country, setter, color flag, and its setter.
 */
export function useHomeCountry() {
  const { settings, updateSettings } = useSettings();

  const setHomeCountry = (country: string) =>
    updateSettings({ homeCountry: country });

  const colorHomeCountry = !!settings?.colorHomeCountry;
  const setColorHomeCountry = (value: boolean) =>
    updateSettings({ colorHomeCountry: value });

  return {
    homeCountry: settings?.homeCountry,
    setHomeCountry,
    colorHomeCountry,
    setColorHomeCountry,
  };
}
