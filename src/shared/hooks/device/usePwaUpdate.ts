import { useState, useCallback, useEffect, useRef } from "react";
import { isWindowDefined } from "@utils";
import { useEventListener } from "../dom/useEventListener";

/**
 * Detects PWA updates via service worker events.
 * @returns Object with needRefresh flag and updateServiceWorker function
 */
export function usePwaUpdate() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const waitingRef = useRef<ServiceWorker | null>(null);
  const bcRef = useRef<BroadcastChannel | null>(null);

  // Track initial mount time to distinguish startup updates from active session updates
  const isInitialLoadRef = useRef(true);

  // Mark initial load finished shortly after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      isInitialLoadRef.current = false;
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Initialize BroadcastChannel
  useEffect(() => {
    if (!isWindowDefined()) return;
    try {
      bcRef.current = new BroadcastChannel("sw-update");
    } catch {
      bcRef.current = null;
    }
    return () => {
      try {
        bcRef.current?.close();
      } catch {
        // ignore close errors
      }
      bcRef.current = null;
    };
  }, []);

  // Silent update trigger helper
  const activateSilently = useCallback((worker: ServiceWorker) => {
    try {
      worker.postMessage({ type: "SKIP_WAITING" });
    } catch {
      // ignore
    }
  }, []);

  // On initial load, check if there's a waiting service worker and activate it silently
  useEffect(() => {
    if (!isWindowDefined() || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker.getRegistration().then((reg) => {
      if (reg?.waiting) {
        activateSilently(reg.waiting);
      }
    });
  }, [activateSilently]);

  // Handle the "swUpdated" custom event
  const onSWUpdate = useCallback(
    (event: Event) => {
      const customEvent = event as CustomEvent<{ waiting?: ServiceWorker }>;
      const w = customEvent.detail?.waiting || null;
      waitingRef.current = w;

      if (isInitialLoadRef.current) {
        if (w) activateSilently(w);
        return;
      }

      if (navigator.onLine) {
        setNeedRefresh(true);
        try {
          bcRef.current?.postMessage({ type: "update-available" });
        } catch {
          // ignore postMessage failures
        }
      }
    },
    [activateSilently],
  );

  useEventListener(
    "swUpdated",
    onSWUpdate,
    isWindowDefined() ? window : undefined,
  );

  // Listen for online recovery & cross-tab messages
  useEffect(() => {
    const bc = bcRef.current;

    const handleMessage = (ev: MessageEvent) => {
      if (ev.data?.type === "update-available" && navigator.onLine) {
        setNeedRefresh(true);
      }
      if (ev.data?.type === "reload-now") {
        window.location.reload();
      }
    };

    // If device comes back online and an update was waiting, show prompt now
    const handleOnline = () => {
      if (waitingRef.current && !isInitialLoadRef.current) {
        setNeedRefresh(true);
      }
    };

    try {
      bc?.addEventListener("message", handleMessage);
      window.addEventListener("online", handleOnline);
    } catch {
      // ignore
    }

    return () => {
      try {
        bc?.removeEventListener("message", handleMessage);
        window.removeEventListener("online", handleOnline);
      } catch {
        // ignore
      }
    };
  }, []);

  // Trigger service worker update on user action
  const updateServiceWorker = useCallback(() => {
    const bc = bcRef.current;
    const w = waitingRef.current;

    if (w && "serviceWorker" in navigator) {
      const onControllerChange = () => {
        try {
          bc?.postMessage({ type: "reload-now" });
        } catch {
          // ignore
        }
        window.location.reload();
      };

      try {
        navigator.serviceWorker.addEventListener(
          "controllerchange",
          onControllerChange,
          { once: true },
        );
      } catch {
        // ignore
      }

      try {
        w.postMessage({ type: "SKIP_WAITING" });
      } catch {
        window.location.reload();
      }
    } else {
      try {
        bc?.postMessage({ type: "reload-now" });
      } catch {
        // ignore
      }
      window.location.reload();
    }
  }, []);

  return { needRefresh, updateServiceWorker };
}
