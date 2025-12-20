import { useEffect, useState, useCallback } from "react";

// Only import if running in the browser
const isClient = typeof window !== "undefined";

export function usePwaUpdate() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(
    null
  );

  // Listen for the service worker update event
  useEffect(() => {
    if (!isClient) return;

    // VitePWA injects a global 'window.__SW_UPDATE__' event
    const onSWUpdate = (event: Event) => {
      setNeedRefresh(true);
      const customEvent = event as CustomEvent<{ waiting?: ServiceWorker }>;
      setWaitingWorker(customEvent.detail?.waiting || null);
    };

    window.addEventListener("swUpdated", onSWUpdate as EventListener);

    return () => {
      window.removeEventListener("swUpdated", onSWUpdate as EventListener);
    };
  }, []);

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
