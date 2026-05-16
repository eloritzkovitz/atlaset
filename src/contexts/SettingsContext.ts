import { createContext, useContext } from "react";
import { defaultSettings } from "@features/settings";
import type { Settings } from "@features/settings/types";

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
