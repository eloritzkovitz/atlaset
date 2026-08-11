import { useCallback, useEffect, useRef, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

/**
 * Detects PWA updates via service worker events.
 * @returns Object with needRefresh flag and updateServiceWorker function
 */
export function usePwaUpdate() {
  const [needRefreshState, setNeedRefreshState] = useState(false);
  const bcRef = useRef<BroadcastChannel | null>(null);

  const {
    needRefresh: [pwaNeedRefresh],
    updateServiceWorker: pwaUpdateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(
      _swUrl: string | undefined,
      registration: ServiceWorkerRegistration | undefined,
    ) {
      if (registration) {
        setInterval(
          () => {
            registration.update();
          },
          15 * 60 * 1000,
        );
      }
    },
    onRegisterError(error: unknown) {
      console.error("SW registration error", error);
    },
  });

  // Sync state with Workbox & Online status
  useEffect(() => {
    if (pwaNeedRefresh && navigator.onLine) {
      setNeedRefreshState(true);
      try {
        bcRef.current?.postMessage({ type: "update-available" });
      } catch {
        // ignore
      }
    }
  }, [pwaNeedRefresh]);

  // Setup BroadcastChannel for cross-tab communication
  useEffect(() => {
    try {
      bcRef.current = new BroadcastChannel("sw-update");
    } catch {
      bcRef.current = null;
    }

    const bc = bcRef.current;

    const handleMessage = (ev: MessageEvent) => {
      if (ev.data?.type === "update-available" && navigator.onLine) {
        setNeedRefreshState(true);
      }
      if (ev.data?.type === "reload-now") {
        window.location.reload();
      }
    };

    try {
      bc?.addEventListener("message", handleMessage);
    } catch {
      // ignore
    }

    return () => {
      try {
        bc?.removeEventListener("message", handleMessage);
        bc?.close();
      } catch {
        // ignore
      }
      bcRef.current = null;
    };
  }, []);

  // Update trigger that alerts all open tabs to reload
  const updateServiceWorker = useCallback(() => {
    try {
      bcRef.current?.postMessage({ type: "reload-now" });
    } catch {
      // ignore
    }
    pwaUpdateServiceWorker(true);
  }, [pwaUpdateServiceWorker]);

  return {
    needRefresh: needRefreshState,
    updateServiceWorker,
  };
}
