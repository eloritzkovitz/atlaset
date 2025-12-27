import { useRegisterSW } from "virtual:pwa-register/react";

/**
 * Manages PWA updates by checking for new service worker versions.
 * @returns - An object containing:
 *   - needRefresh: A boolean indicating if a new version is available.
 *   - updateServiceWorker: A function to update the service worker and refresh the app.
 */
export function usePwaUpdate() {
  let needRefresh = false;
  let updateServiceWorker = () => window.location.reload();

  // useRegisterSW returns a tuple: { needRefresh, updateServiceWorker, ... }
  const sw = useRegisterSW({
    onNeedRefresh() {
      // This callback is invoked when a new service worker is available
    },
    onOfflineReady() {
      // This callback is invoked when the app is ready to work offline
    },
  });

  // The hook returns an object with needRefresh and updateServiceWorker
  needRefresh = sw.needRefresh;
  updateServiceWorker = sw.updateServiceWorker;

  return { needRefresh, updateServiceWorker };
}
