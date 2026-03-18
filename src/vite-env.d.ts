declare module "react-simple-maps";
declare module "virtual:pwa-register/react";
declare module "virtual:pwa-register" {
  export function registerSW(options?: {
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
  }): void;
}
