import { useSettings } from "@contexts/SettingsContext";

/**
 * Manages home country settings.
 * @returns Home country, setter, color flag, and its setter.
 */
export function useHomeCountry() {
  const { settings, updateSettings } = useSettings();

  const setHomeCountry = (country: string) =>
    updateSettings({ account: { homeCountry: country } });

  return {
    homeCountry: settings?.account?.homeCountry ?? "",
    setHomeCountry,
  };
}
