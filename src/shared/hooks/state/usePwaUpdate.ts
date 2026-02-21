import { useState, useCallback } from "react";
import { useEventListener } from "../dom/useEventListener";
import { isWindowDefined } from "../../utils/env";

/**
 * Detects PWA updates via service worker events.
 * @returns Object with needRefresh flag and updateServiceWorker function
 */
export function usePwaUpdate() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(
    null,
  );

  // Listen for the service worker update event using useEventListener
  const onSWUpdate = useCallback((event: Event) => {
    setNeedRefresh(true);
    const customEvent = event as CustomEvent<{ waiting?: ServiceWorker }>;
    setWaitingWorker(customEvent.detail?.waiting || null);
  }, []);

  // Listen for the custom "swUpdated" event dispatched by the service worker registration logic
  useEventListener(
    "swUpdated",
    onSWUpdate,
    isWindowDefined() ? window : undefined,
  );

  const updateServiceWorker = useCallback(() => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
      window.location.reload();
    } else {
      // fallback: reload anyway
      window.location.reload();
    }
  }, [waitingWorker]);

  return { needRefresh, updateServiceWorker };
}
