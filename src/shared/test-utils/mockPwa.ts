import { useState } from "react";

export function useRegisterSW(_options?: any) {
  const [needRefresh, setNeedRefresh] = useState(false);
  const updateServiceWorker = (_reloadPage?: boolean) => {};

  return {
    needRefresh: [needRefresh, setNeedRefresh] as const,
    offlineReady: [false, (_val: boolean) => {}] as const,
    updateServiceWorker,
  };
}

export function registerSW() {
  return (_reloadPage?: boolean) => Promise.resolve();
}
