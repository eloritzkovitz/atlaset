import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { settingsService } from "@features/settings";
import { defaultSettings } from "@features/settings/constants/defaultSettings";
import type { Settings } from "@features/settings/types";
import { useAuth } from "./AuthContext";

const SettingsContext = createContext<{
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

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  // Fetch settings on mount
  const { user, ready } = useAuth();

  useEffect(() => {
    let mounted = true;
    if (!ready) return;
    setLoading(true);
    settingsService.load().then((s) => {
      if (mounted) {
        setSettings(s);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [user, ready]);

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      settings.theme === "dark"
    );
  }, [settings.theme]);

  // Update settings in IndexedDB
  const updateSettings = async (updates: Partial<Settings>) => {
    const newSettings = { ...settings, ...updates, id: "main" };
    await settingsService.save(newSettings);
    setSettings(newSettings);
  };

  // Reset settings to default
  const resetSettings = useCallback(async () => {
    await settingsService.save(defaultSettings);
    setSettings(defaultSettings);
  }, []);

  return (
    <SettingsContext.Provider
      value={{ settings, updateSettings, resetSettings, loading }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

// Custom hook to use the SettingsContext
export const useSettings = () => useContext(SettingsContext);
