import i18n from "i18next";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { isRtl } from "@features/settings";
import "@lib/i18n";
import App from "./app/App";
import { store } from "./app/store";
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
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
