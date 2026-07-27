import { defaultSettings } from "../../common/constants/defaultSettings";
import { useSettings } from "../../common/hooks/useSettings";

/**
 * Manages the date locale setting for the application.
 */
export function useDateLocale(): [
  string | null | undefined,
  (loc: string | null) => void,
] {
  const { settings, updateSettings } = useSettings();
  const dateLocale =
    settings?.account.languageRegion?.dateLocale ??
    defaultSettings.account.languageRegion.dateLocale;

  const setDateLocale = (loc: string | null) => {
    updateSettings({
      account: {
        ...settings.account,
        languageRegion: {
          ...(settings.account.languageRegion ?? {}),
          dateLocale: loc,
        },
      },
    });
  };

  return [dateLocale, setDateLocale];
}
