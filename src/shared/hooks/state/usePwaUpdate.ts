import { useState, useCallback, useEffect, useRef } from "react";
import { useEventListener } from "../dom/useEventListener";
import { isWindowDefined } from "../../utils/env";

/**
 * Detects PWA updates via service worker events.
 * @returns Object with needRefresh flag and updateServiceWorker function
 */
export function usePwaUpdate() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const waitingRef = useRef<ServiceWorker | null>(null);
  const bcRef = useRef<BroadcastChannel | null>(null);

  // Initialize BroadcastChannel for cross-tab communication about updates
  useEffect(() => {
    if (!isWindowDefined()) return;
    try {
      bcRef.current = new BroadcastChannel("sw-update");
    } catch (err) {
      bcRef.current = null;
    }
    return () => {
      try {
        bcRef.current?.close();
      } catch {}
      bcRef.current = null;
    };
  }, []);

  // Handle the "swUpdated" event dispatched from the service worker registration logic
  const onSWUpdate = useCallback((event: Event) => {
    setNeedRefresh(true);
    const customEvent = event as CustomEvent<{ waiting?: ServiceWorker }>;
    const w = customEvent.detail?.waiting || null;
    waitingRef.current = w;
    try {
      bcRef.current?.postMessage({ type: "update-available" });
    } catch {}
  }, []);

  useEventListener(
    "swUpdated",
    onSWUpdate,
    isWindowDefined() ? window : undefined,
  );

  // Listen for messages from other tabs about updates
  useEffect(() => {
    const bc = bcRef.current;
    if (!bc) return;
    const handle = (ev: MessageEvent) => {
      if (ev.data?.type === "update-available") setNeedRefresh(true);
      if (ev.data?.type === "reload-now") window.location.reload();
    };
    bc.addEventListener("message", handle);
    return () => bc.removeEventListener("message", handle);
  }, []);

  // Function to trigger the service worker update process
  const updateServiceWorker = useCallback(() => {
    const bc = bcRef.current;
    const w = waitingRef.current;

    if (w && "serviceWorker" in navigator) {
      const onControllerChange = () => {
        try {
          // notify other tabs to reload now that the new SW controls clients
          bc?.postMessage({ type: "reload-now" });
        } catch {}
        window.location.reload();
        try {
          navigator.serviceWorker.removeEventListener(
            "controllerchange",
            onControllerChange,
          );
        } catch {}
      };

      try {
        navigator.serviceWorker.addEventListener(
          "controllerchange",
          onControllerChange,
        );
      } catch {}

      try {
        w.postMessage({ type: "SKIP_WAITING" });
      } catch {
        // if postMessage fails, fallback to reload
        window.location.reload();
      }
    } else {
      try {
        bc?.postMessage({ type: "reload-now" });
      } catch {}
      window.location.reload();
    }
  }, []);

  return { needRefresh, updateServiceWorker };
}
