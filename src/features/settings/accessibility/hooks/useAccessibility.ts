import { useEffect, useState } from "react";
import { useSettings } from "../../common/hooks/useSettings";

/**
 * Manages user accessibility preferences.
 */
export function useAccessibility() {
  const { settings, updateSettings } = useSettings();

  const initialSingleKey = !!settings.accessibility?.singleKeyShortcutsEnabled;
  const initialAnimationsEnabled =
    settings.accessibility?.animationsEnabled !== false;

  const [singleKeyShortcutsEnabled, setSingleKeyShortcutsEnabledState] =
    useState<boolean>(initialSingleKey);
  const [animationsEnabled, setAnimationsEnabledState] = useState<boolean>(
    initialAnimationsEnabled,
  );

  // Sync state with settings context on mount and when settings change
  useEffect(() => {
    setSingleKeyShortcutsEnabledState(
      !!settings.accessibility?.singleKeyShortcutsEnabled,
    );
  }, [settings.accessibility?.singleKeyShortcutsEnabled]);

  useEffect(() => {
    setAnimationsEnabledState(
      settings.accessibility?.animationsEnabled !== false,
    );
  }, [settings.accessibility?.animationsEnabled]);

  // Update settings when state changes
  const setSingleKeyShortcutsEnabled = (enabled: boolean) => {
    setSingleKeyShortcutsEnabledState(enabled);
    updateSettings({
      accessibility: {
        ...(settings.accessibility ?? {}),
        singleKeyShortcutsEnabled: enabled,
      },
    });
  };

  const setAnimationsEnabled = (enabled: boolean) => {
    setAnimationsEnabledState(enabled);
    updateSettings({
      accessibility: {
        ...(settings.accessibility ?? {}),
        animationsEnabled: enabled,
      },
    });
  };

  return {
    singleKeyShortcutsEnabled,
    setSingleKeyShortcutsEnabled,
    animationsEnabled,
    setAnimationsEnabled,
  };
}
