import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { AudioProvider } from "@contexts/AudioProvider";
import { SettingsProvider } from "@contexts/SettingsProvider";
import App from "./App";
import { store } from "./store";
import "./styles/index.css";

// Detect Electron environment
const isElectron = !!window?.process?.versions?.electron;

const Router = isElectron ? HashRouter : BrowserRouter;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <SettingsProvider>
          <AudioProvider>
            <App />
          </AudioProvider>
        </SettingsProvider>
      </Router>
    </Provider>
  </StrictMode>
);
