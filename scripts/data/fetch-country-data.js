/**
 * Fetches country data from a remote server and stores them locally.
 * Only downloads if the remote data has changed.
 */

import path from "path";
import { fileURLToPath } from "url";
import {
  fetchWithRetries,
  ensureDirExists,
  readLocalFile,
  writeLocalFile,
} from "../lib/fetchUtils.js";

// Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COUNTRY_DATA_URL =
  process.env.VITE_COUNTRY_DATA_URL ||
  "https://atlaset-data-server.onrender.com/data/countries.json";
const CURRENCY_DATA_URL =
  process.env.VITE_CURRENCY_DATA_URL ||
  "https://atlaset-data-server.onrender.com/data/currencies.json";
const DEST_DIR = path.join(__dirname, "../../public/data");

ensureDirExists(DEST_DIR);

// Main logic: only fetch if file changed
(async () => {
  try {
    // Fetch countries.json
    console.log(`Fetching: countries.json -> ${COUNTRY_DATA_URL}`);
    const countryRaw = await fetchWithRetries(COUNTRY_DATA_URL);
    const localCountryRaw = readLocalFile(DEST_DIR, "countries.json");
    if (!localCountryRaw || localCountryRaw !== countryRaw) {
      writeLocalFile(DEST_DIR, "countries.json", countryRaw);
      console.log(`countries.json downloaded and updated!`);
    } else {
      console.log(`countries.json is up to date. No download needed.`);
    }

    // Fetch currencies.json
    console.log(`Fetching: currencies.json -> ${CURRENCY_DATA_URL}`);
    const currencyRaw = await fetchWithRetries(CURRENCY_DATA_URL);
    const localCurrencyRaw = readLocalFile(DEST_DIR, "currencies.json");
    if (!localCurrencyRaw || localCurrencyRaw !== currencyRaw) {
      writeLocalFile(DEST_DIR, "currencies.json", currencyRaw);
      console.log(`currencies.json downloaded and updated!`);
    } else {
      console.log(`currencies.json is up to date. No download needed.`);
    }
    console.log("All country data files checked and updated.");
  } catch (err) {
    console.error("Error downloading country data:", err);
    process.exit(1);
  }
})();
