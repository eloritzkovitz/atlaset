import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { AudioProvider } from "@contexts/AudioProvider";
import { AuthProvider } from "@contexts/AuthProvider";
import { SettingsProvider } from "@contexts/SettingsProvider";
import App from "./App";
import { store } from "./store";
import "./styles/index.css";
import "./styles/markdown.css";

// Register service worker for PWA update detection
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  // Dynamically import virtual:pwa-register for VitePWA
  import("virtual:pwa-register").then(({ registerSW }) => {
    registerSW({
      onNeedRefresh() {
        // Dispatch swUpdated event for usePwaUpdate hook
        window.dispatchEvent(new CustomEvent("swUpdated"));
      },
    });
  });
}

// Detect Electron environment
const isElectron = !!window?.process?.versions?.electron;

// eslint-disable-next-line react-refresh/only-export-components
const Router = isElectron ? HashRouter : BrowserRouter;

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
