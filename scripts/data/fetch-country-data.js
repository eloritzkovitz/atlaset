/**
 * Fetches country data from a remote server and stores them locally.
 * Only downloads if the remote data has changed.
 */

import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

// Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKEND_URL =
  process.env.VITE_COUNTRY_DATA_URL ||
  "https://atlaset-data-server.onrender.com/data";
const DEST_DIR = path.join(__dirname, "../../public/data");

fs.mkdirSync(DEST_DIR, { recursive: true });

const FILES = ["countries.json", "currencies.json"];

/**
 * Fetch a remote file as a string
 * @param {string} filename
 * @returns {Promise<string>}
 */
function fetchRemoteFile(filename) {
  return new Promise((resolve, reject) => {
    https.get(`${BACKEND_URL}/${filename}`, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
      res.on("error", reject);
    });
  });
}

/**
 * Read a local file as a string, or null if not present
 * @param {string} filename
 */
function readLocalFile(filename) {
  const localPath = path.join(DEST_DIR, filename);
  if (!fs.existsSync(localPath)) return null;
  return fs.readFileSync(localPath, "utf8");
}

// Main logic: only fetch if file changed
(async () => {
  try {
    for (const filename of FILES) {
      const remoteRaw = await fetchRemoteFile(filename);
      const localRaw = readLocalFile(filename);
      if (localRaw && localRaw === remoteRaw) {
        console.log(`${filename} is up to date. No download needed.`);
        continue;
      }
      fs.writeFileSync(path.join(DEST_DIR, filename), remoteRaw);
      console.log(`${filename} downloaded and updated!`);
    }
    console.log("All country data files checked and updated.");
  } catch (err) {
    console.error("Error downloading country data:", err);
    process.exit(1);
  }
})();
