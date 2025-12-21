import { createContext, useContext } from "react";
import type { Settings } from "@features/settings/types";
import { defaultSettings } from "@features/settings/constants/defaultSettings";

interface SettingsContextType {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  loading: boolean;
}

export const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: async () => {},
  resetSettings: async () => {},
  loading: false,
});

export function useSettings() {
  return useContext(SettingsContext);
}
