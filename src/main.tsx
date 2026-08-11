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
