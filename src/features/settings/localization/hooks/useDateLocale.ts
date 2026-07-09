import { useContext } from "react";
import { SettingsContext } from "@contexts/SettingsContext";
import { defaultSettings } from "@features/settings";

/**
 * Manages the date locale setting for the app, which controls how dates are formatted.
 * @returns A tuple of [dateLocale, setDateLocale] where:
 * - `dateLocale` is the current date locale string (e.g. "en-GB", "en-US") or null/undefined for default.
 * - `setDateLocale` is a function to update the date locale, accepting a string or null to reset to default.
 */
export function useDateLocale(): [
  string | null | undefined,
  (loc: string | null) => void,
] {
  const { settings, updateSettings } = useContext(SettingsContext);
  const dateLocale =
    settings?.localization?.dateLocale ??
    defaultSettings.localization.dateLocale;

  const setDateLocale = (loc: string | null) => {
    updateSettings({
      localization: { ...(settings.localization ?? {}), dateLocale: loc },
    });
  };

  return [dateLocale, setDateLocale];
}
