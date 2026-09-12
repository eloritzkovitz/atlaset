import { useCallback, useEffect, useRef, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

export function handlePwaUpdateMessage(
  event: MessageEvent,
  isOnline: boolean,
  onUpdateAvailable: (value: boolean) => void,
  reload: () => void,
) {
  if (event.data?.type === "update-available" && isOnline) {
    onUpdateAvailable(true);
  }
  if (event.data?.type === "reload-now") {
    reload();
  }
}

/**
 * Detects PWA updates via service worker events.
 * @returns Object with needRefresh flag and updateServiceWorker function
 */
export function usePwaUpdate() {
  const [needRefreshState, setNeedRefreshState] = useState(false);
  const bcRef = useRef<BroadcastChannel | null>(null);
  const registrationReadyRef = useRef(false);
  const initialCheckRef = useRef(true);

  const {
    needRefresh: [pwaNeedRefresh],
    updateServiceWorker: pwaUpdateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(
      _swUrl: string | undefined,
      registration: ServiceWorkerRegistration | undefined,
    ) {
      if (registration) {
        void registration
          .update()
          .then(() => {
            if (
              initialCheckRef.current &&
              registration.waiting &&
              navigator.onLine
            ) {
              void pwaUpdateServiceWorker(true);
            }

            initialCheckRef.current = false;
            registrationReadyRef.current = true;
          })
          .catch(() => {
            initialCheckRef.current = false;
            registrationReadyRef.current = true;
          });

        const intervalId = setInterval(
          () => {
            void registration.update();
          },
          15 * 60 * 1000,
        );

        return () => clearInterval(intervalId);
      }

      initialCheckRef.current = false;
      registrationReadyRef.current = true;
    },
    onRegisterError(error: unknown) {
      console.error("SW registration error", error);
      initialCheckRef.current = false;
      registrationReadyRef.current = true;
    },
  });

  // Sync state with Workbox & Online status
  useEffect(() => {
    if (
      pwaNeedRefresh &&
      navigator.onLine &&
      registrationReadyRef.current &&
      !initialCheckRef.current
    ) {
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
      handlePwaUpdateMessage(
        ev,
        navigator.onLine,
        setNeedRefreshState,
        window.location.reload,
      );
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
  const updateServiceWorker = useCallback(async () => {
    await pwaUpdateServiceWorker(true);

    try {
      bcRef.current?.postMessage({ type: "reload-now" });
    } catch {
      // ignore
    }
  }, [pwaUpdateServiceWorker]);

  return {
    needRefresh: needRefreshState,
    updateServiceWorker,
  };
}
