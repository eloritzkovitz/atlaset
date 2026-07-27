import i18n from "i18next";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { AudioProvider } from "@contexts/AudioProvider";
import { isRtl } from "@features/settings";
import { AuthListener } from "@features/user/auth/components/AuthListener";
import { SettingsInitializer } from "@features/settings/common/components/SettingsInitializer";
import App from "./App";
import "./i18n";
import { store } from "./store";
import "./styles/index.css";
import "./styles/markdown.css";

// Register service worker for PWA update detection
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  import("virtual:pwa-register").then(({ registerSW }) => {
    registerSW({
      onNeedRefresh() {
        // Notify the app only when a waiting service worker actually exists
        navigator.serviceWorker
          .getRegistration()
          .then((reg) => {
            const waiting = reg?.waiting || null;
            if (waiting) {
              window.dispatchEvent(
                new CustomEvent("swUpdated", { detail: { waiting } }),
              );
            }
          })
          .catch(() => {});
      },
    });
  });
}

// eslint-disable-next-line react-refresh/only-export-components
const Router = BrowserRouter;

// Set initial document direction based on current language
const setDocDirection = (lang: string) => {
  try {
    document.documentElement.lang = lang;
    const rtl = isRtl(lang);
    document.documentElement.dir = rtl ? "rtl" : "ltr";
  } catch {
    // server-side or non-browser environments
  }
};

setDocDirection(i18n.language || "en");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <AuthListener />
        <SettingsInitializer />
        <AudioProvider>
          <App />
        </AudioProvider>
      </Router>
    </Provider>
  </StrictMode>,
);
