import { useSettings } from "@contexts/SettingsContext";

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
