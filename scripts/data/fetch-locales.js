/**
 * Fetches per-locale country and currency overlays and stores them under
 * `public/locales/{lng}/countries.json` and `public/locales/{lng}/currencies.json`.
 * Only writes files when the remote content differs from local content.
 */

import path from "path";
import { fileURLToPath } from "url";
import {
  fetchWithRetries,
  ensureDirExists,
  readLocalFile,
  writeLocalFile,
} from "../lib/fetchUtils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_LOCALES = ["he"]; // English is not needed since it's the app default
const DEFAULT_BASE_URL =
  process.env.VITE_LOCALES_URL ||
  "https://atlaset-data-server.onrender.com/locales";

// DEST base directory for locale files
const DEST_BASE = path.join(__dirname, "../../public/locales");

ensureDirExists(DEST_BASE);

const rawLocales = process.env.VITE_LOCALES || process.env.LOCALES || "";
const LOCALES = rawLocales
  ? rawLocales
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  : DEFAULT_LOCALES;

// Constructs the remote URL for a given locale and filename based on the base URL
const remoteUrlFor = (base, lng, filename) => {
  // If base contains a placeholder {lng}, replace it. Otherwise assume base/<lng>/<filename>
  if (base.includes("{lng}")) {
    return `${base.replace("{lng}", lng)}/${filename}`;
  }
  return `${base}/${lng}/${filename}`;
};

(async () => {
  let anyFailure = false;
  for (const lng of LOCALES) {
    try {
      const localeDir = path.join(DEST_BASE, lng);
      ensureDirExists(localeDir);

      // countries.json
      const countriesUrl = remoteUrlFor(
        DEFAULT_BASE_URL,
        lng,
        "countries.json",
      );
      console.log(`Fetching: ${lng}/countries.json -> ${countriesUrl}`);

      try {
        const countriesRaw = await fetchWithRetries(countriesUrl);
        const localCountriesRaw = readLocalFile(localeDir, "countries.json");
        if (!localCountriesRaw || localCountriesRaw !== countriesRaw) {
          writeLocalFile(localeDir, "countries.json", countriesRaw);
          console.log(`${lng}/countries.json downloaded and updated!`);
        } else {
          console.log(`${lng}/countries.json is up to date.`);
        }
      } catch (err) {
        console.warn(
          `Warning: failed to fetch ${lng}/countries.json:`,
          err.message || err,
        );
      }

      // currencies.json
      const currenciesUrl = remoteUrlFor(
        DEFAULT_BASE_URL,
        lng,
        "currencies.json",
      );
      console.log(`Fetching: ${lng}/currencies.json -> ${currenciesUrl}`);
      try {
        const currenciesRaw = await fetchWithRetries(currenciesUrl);
        const localCurrenciesRaw = readLocalFile(localeDir, "currencies.json");
        if (!localCurrenciesRaw || localCurrenciesRaw !== currenciesRaw) {
          writeLocalFile(localeDir, "currencies.json", currenciesRaw);
          console.log(`${lng}/currencies.json downloaded and updated!`);
        } else {
          console.log(`${lng}/currencies.json is up to date.`);
        }
      } catch (err) {
        console.warn(
          `Warning: failed to fetch ${lng}/currencies.json:`,
          err.message || err,
        );
      }
    } catch (err) {
      anyFailure = true;
      console.error(`Error processing locale ${lng}:`, err);
    }
  }

  // If any locale failed, exit with error code
  if (anyFailure) {
    console.error("Some locales failed to update. See logs above.");
    process.exit(1);
  }

  console.log("All locale files checked and updated.");
})();
