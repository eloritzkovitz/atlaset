import { useUI } from "@app/contexts/UIContext";
import { useAccessibility } from "@features/settings/accessibility";
import { useKeyHandler } from "@hooks";
import { isAuthenticated } from "@lib/firebase";

/** Global keyboard shortcuts for the application. */
export function GlobalShortcuts() {
  const { singleKeyShortcutsEnabled } = useAccessibility();
  const { toggleUiVisible, toggleFriends, toggleHelp, toggleShortcuts } =
    useUI();

  const opts = (enabled = true) => ({
    enabled,
    allowSingleKeyShortcuts: singleKeyShortcutsEnabled,
  });

  useKeyHandler(toggleUiVisible, ["u", "U"], opts());
  useKeyHandler(toggleFriends, ["n", "N"], opts(isAuthenticated()));
  useKeyHandler(toggleHelp, ["h", "H"], opts());
  useKeyHandler(toggleShortcuts, ["?"], opts());

  return null;
}
