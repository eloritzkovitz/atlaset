/**
 * Fetches country facts data from a remote server and stores it locally.
 * Only downloads if the remote data has changed.
 */

import "dotenv/config";
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

const DATA_URL = process.env.VITE_DATA_URL;

if (!DATA_URL) {
	throw new Error("VITE_DATA_URL is not configured.");
}

const COUNTRY_FACTS_DATA_URL = `${DATA_URL}/data/countryFacts.json`;
const DEST_DIR = path.join(__dirname, "../../public/data");

ensureDirExists(DEST_DIR);

const FILENAME = "countryFacts.json";

// Main logic: only fetch if file changed
(async () => {
  try {
    console.log(`Fetching: ${FILENAME} -> ${COUNTRY_FACTS_DATA_URL}`);
    const remoteRaw = await fetchWithRetries(COUNTRY_FACTS_DATA_URL);
    const localRaw = readLocalFile(DEST_DIR, FILENAME);
    if (localRaw && localRaw === remoteRaw) {
      console.log(`${FILENAME} is up to date. No download needed.`);
      return;
    }
    writeLocalFile(DEST_DIR, FILENAME, remoteRaw);
    console.log(`${FILENAME} downloaded and updated!`);
  } catch (err) {
    console.error("Error downloading facts data:", err);
    process.exit(1);
  }
})();
