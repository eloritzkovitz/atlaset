/**
 * Fetches geography data from a remote server and stores it locally.
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
  process.env.VITE_GEODATA_URL ||
  "https://atlaset-data-server.onrender.com/data";
const DEST_DIR = path.join(__dirname, "../../public/data");

fs.mkdirSync(DEST_DIR, { recursive: true });

const FILENAME = "countries.geojson";

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
    const remoteRaw = await fetchRemoteFile(FILENAME);
    const localRaw = readLocalFile(FILENAME);
    if (localRaw && localRaw === remoteRaw) {
      console.log(`${FILENAME} is up to date. No download needed.`);
      return;
    }
    fs.writeFileSync(path.join(DEST_DIR, FILENAME), remoteRaw);
    console.log(`${FILENAME} downloaded and updated!`);
  } catch (err) {
    console.error("Error downloading geoData:", err);
    process.exit(1);
  }
})();
