import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { AudioProvider } from "@contexts/AudioProvider";
import { AuthProvider } from "@contexts/AuthProvider";
import { SettingsProvider } from "@contexts/SettingsProvider";
import App from "./App";
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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <AuthProvider>
          <SettingsProvider>
            <AudioProvider>
              <App />
            </AudioProvider>
          </SettingsProvider>
        </AuthProvider>
      </Router>
    </Provider>
  </StrictMode>,
);
