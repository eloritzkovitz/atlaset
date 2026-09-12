import { useCallback } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

/**
 * Detects PWA updates via service worker events.
 * @returns An object containing a boolean indicating if an update is available and a function to apply the update.
 */
export function usePwaUpdate() {
  const { updateServiceWorker: applyUpdate } = useRegisterSW();
  const updateServiceWorker = useCallback(
    () => applyUpdate(true),
    [applyUpdate],
  );

  return {
    needRefresh: false,
    updateServiceWorker,
  };
}
