import { useState } from "react";

export function useRegisterSW() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const updateServiceWorker = () => {};

  return {
    needRefresh: [needRefresh, setNeedRefresh] as const,
    offlineReady: [false, () => {}] as const,
    updateServiceWorker,
  };
}

export function registerSW() {
  return () => Promise.resolve();
}
