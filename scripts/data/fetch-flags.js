/**
 * Fetches country flags from a remote server and stores them locally.
 * The script retrieves a list of available flags and downloads each one
 * into the specified directory.
 */

import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

// Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKEND_URL =
  process.env.VITE_FLAG_DATA_URL ||
  "https://atlaset-data-server.onrender.com/flags";
const DEST_DIR = path.join(__dirname, "../../public/flags");

fs.mkdirSync(DEST_DIR, { recursive: true });

/**
 * Fetch the remote index.json as a string
 * @returns Promise that resolves to the raw index.json string
 */
function fetchRemoteIndex() {
  return new Promise((resolve, reject) => {
    https.get(`${BACKEND_URL}/index.json`, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
      res.on("error", reject);
    });
  });
}

/**
 * Read the local index.json as a string, or null if not present
 */
function readLocalIndex() {
  const localPath = path.join(DEST_DIR, "index.json");
  if (!fs.existsSync(localPath)) return null;
  return fs.readFileSync(localPath, "utf8");
}

/**
 * Download a flag by its ISO code
 * @param iso - ISO country code
 * @returns Promise that resolves when the flag is downloaded
 */
function downloadFlag(iso) {
  const filename = iso.endsWith(".svg") ? iso : `${iso}.svg`;
  const dest = path.join(DEST_DIR, filename);
  if (fs.existsSync(dest)) {
    return Promise.resolve(); // Skip if already exists
  }
  return new Promise((resolve, reject) => {
    const url = `${BACKEND_URL}/${filename}`;
    const dest = path.join(DEST_DIR, filename);
    const file = fs.createWriteStream(dest);
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          return reject(
            new Error(`Failed to fetch ${url}: ${response.statusCode}`)
          );
        }
        response.pipe(file);
        file.on("finish", () => file.close(resolve));
      })
      .on("error", reject);
  });
}

// Main logic: only fetch if index.json changed
(async () => {
  try {
    const remoteIndexRaw = await fetchRemoteIndex();
    const localIndexRaw = readLocalIndex();
    if (localIndexRaw && localIndexRaw === remoteIndexRaw) {
      console.log("Flags are up to date. No download needed.");
      return;
    }
    // Save new index.json
    fs.writeFileSync(path.join(DEST_DIR, "index.json"), remoteIndexRaw);
    const flags = JSON.parse(remoteIndexRaw);
    await Promise.all(flags.map(downloadFlag));
    console.log("All flags downloaded and index.json updated!");
  } catch (err) {
    console.error("Error downloading flags:", err);
    process.exit(1);
  }
})();
