/**
 * Fetches geography data from a remote server and stores it locally.
 * Only downloads if the remote data has changed.
 */

import path from "path";
import { fileURLToPath } from "url";
import {
  fetchWithRetries,
  ensureDirExists,
  readLocalFile,
  writeLocalFile,
} from "./fetchUtils.js";

// Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKEND_URL =
  process.env.VITE_MAP_GEO_URL ||
  "https://atlaset-data-server.onrender.com/data";
const DEST_DIR = path.join(__dirname, "../../public/data");

ensureDirExists(DEST_DIR);

const FILENAME = "countries.geojson";

/**
 * Fetch a remote file as a string
 * @param {string} filename
 * @returns {Promise<string>}
 */
async function fetchRemoteFile(filename, retries = 5, delayMs = 2000) {
  const url = `${BACKEND_URL}/${filename}`;
  return fetchWithRetries(url, retries, delayMs);
}

// Main logic: only fetch if file changed
(async () => {
  try {
    const remoteRaw = await fetchRemoteFile(FILENAME);
    const localRaw = readLocalFile(DEST_DIR, FILENAME);
    if (localRaw && localRaw === remoteRaw) {
      console.log(`${FILENAME} is up to date. No download needed.`);
      return;
    }
    writeLocalFile(DEST_DIR, FILENAME, remoteRaw);
    console.log(`${FILENAME} downloaded and updated!`);
  } catch (err) {
    console.error("Error downloading geoData:", err);
    process.exit(1);
  }
})();
