/**
 * Fetches country data from a remote server and stores them locally.
 * Only downloads if the remote data has changed.
 */

import path from "path";
import { fileURLToPath } from "url";
import { fetchWithRetries, ensureDirExists, readLocalFile, writeLocalFile } from "./fetchUtils.js";

// Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKEND_URL =
  process.env.VITE_COUNTRY_DATA_URL ||
  "https://atlaset-data-server.onrender.com/data";
const DEST_DIR = path.join(__dirname, "../../public/data");

ensureDirExists(DEST_DIR);

const FILES = ["countries.json", "currencies.json"];

/**
 * Fetch a remote file as a string using fetchWithRetries utility
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
    for (const filename of FILES) {
      const remoteRaw = await fetchRemoteFile(filename);
      const localRaw = readLocalFile(DEST_DIR, filename);
      if (localRaw && localRaw === remoteRaw) {
        console.log(`${filename} is up to date. No download needed.`);
        continue;
      }
      writeLocalFile(DEST_DIR, filename, remoteRaw);
      console.log(`${filename} downloaded and updated!`);
    }
    console.log("All country data files checked and updated.");
  } catch (err) {
    console.error("Error downloading country data:", err);
    process.exit(1);
  }
})();
