import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { AuthProvider } from "@contexts/AuthContext";
import { SettingsProvider } from "@contexts/SettingsContext";
import App from "./App";
import "./styles/index.css";

// Detect Electron environment
const isElectron = !!window?.process?.versions?.electron;

const Router = isElectron ? HashRouter : BrowserRouter;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <SettingsProvider>
          <App />
        </SettingsProvider>
      </AuthProvider>
    </Router>
  </StrictMode>
);
