import { createContext, useContext } from "react";
import { defaultSettings, type Settings } from "@features/settings";

interface SettingsContextType {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  loading: boolean;
  ready: boolean;
}

export const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: async () => {},
  resetSettings: async () => {},
  loading: false,
  ready: false,
});

export function useSettings() {
  return useContext(SettingsContext);
}
