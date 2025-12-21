import { createContext, useContext } from "react";
import type { Settings } from "@features/settings/types";
import { defaultSettings } from "@features/settings/constants/defaultSettings";

export const SettingsContext = createContext<{
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  loading: boolean;
}>({
  settings: defaultSettings,
  updateSettings: async () => {},
  resetSettings: async () => {},
  loading: false,
});

export function useSettings() {
  return useContext(SettingsContext);
}
