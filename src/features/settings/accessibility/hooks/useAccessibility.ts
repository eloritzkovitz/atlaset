import { useEffect, useState } from "react";
import { useSettings } from "@contexts/SettingsContext";

/**
 * Manages user accessibility preferences.
 * @returns Accessibility states and utility functions to update them.
 */
export function useAccessibility() {
  const { settings, updateSettings } = useSettings();

  const initialSingleKey = !!settings.accessibility?.singleKeyShortcutsEnabled;

  const [singleKeyShortcutsEnabled, setSingleKeyShortcutsEnabledState] =
    useState<boolean>(initialSingleKey);

  // Sync state with settings on load and when it changes
  useEffect(() => {
    setSingleKeyShortcutsEnabledState(
      !!settings.accessibility?.singleKeyShortcutsEnabled,
    );
  }, [settings.accessibility?.singleKeyShortcutsEnabled]);

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

  // Toggle function for convenience
  const toggleSingleKeyShortcuts = () => {
    setSingleKeyShortcutsEnabled(!singleKeyShortcutsEnabled);
  };

  return {
    singleKeyShortcutsEnabled,
    setSingleKeyShortcutsEnabled,
    toggleSingleKeyShortcuts,
  };
}
