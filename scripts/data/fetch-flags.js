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
 * Fetch the remote index.json as a string, with retries
 * @returns Promise that resolves to the raw index.json string
 */
async function fetchRemoteIndex(retries = 3, delayMs = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await new Promise((resolve, reject) => {
        https
          .get(`${BACKEND_URL}/index.json`, (res) => {
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
              if (res.statusCode !== 200) {
                reject(
                  new Error(`Failed to fetch index.json: ${res.statusCode}`)
                );
              } else {
                resolve(data);
              }
            });
            res.on("error", reject);
          })
          .on("error", reject);
      });
    } catch (err) {
      console.error(`[fetchRemoteIndex] Attempt ${attempt} failed:`, err);
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, delayMs * attempt));
      } else {
        throw err;
      }
    }
  }
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
 * Download a flag by its ISO code, with retries and error logging
 * @param iso - ISO country code
 * @returns Promise that resolves when the flag is downloaded
 */
async function downloadFlag(iso, retries = 3, delayMs = 1000) {
  const filename = iso.endsWith(".svg") ? iso : `${iso}.svg`;
  const dest = path.join(DEST_DIR, filename);
  if (fs.existsSync(dest)) {
    return; // Skip if already exists
  }
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await new Promise((resolve, reject) => {
        const url = `${BACKEND_URL}/${filename}`;
        const file = fs.createWriteStream(dest);
        https
          .get(url, (response) => {
            if (response.statusCode !== 200) {
              file.close();
              fs.unlink(dest, () => {}); // Clean up partial file
              return reject(
                new Error(`Failed to fetch ${url}: ${response.statusCode}`)
              );
            }
            response.pipe(file);
            file.on("finish", () => file.close(resolve));
          })
          .on("error", (err) => {
            file.close();
            fs.unlink(dest, () => {});
            reject(err);
          });
      });
      return;
    } catch (err) {
      console.error(
        `[downloadFlag] ${filename} attempt ${attempt} failed:`,
        err
      );
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, delayMs * attempt));
      } else {
        throw err;
      }
    }
  }
}

// Main logic: only fetch if index.json changed
(async () => {
  try {
    const remoteIndexRaw = await fetchRemoteIndex();
    const localIndexRaw = readLocalIndex();
    if (localIndexRaw && localIndexRaw === remoteIndexRaw) {
      console.log("[fetch-flags] Flags are up to date. No download needed.");
      return;
    }
    console.log(
      "[fetch-flags] index.json changed or missing, downloading flags..."
    );
    // Save new index.json
    fs.writeFileSync(path.join(DEST_DIR, "index.json"), remoteIndexRaw);
    const flags = JSON.parse(remoteIndexRaw);
    // Download flags sequentially for better error tracking
    for (const flag of flags) {
      try {
        await downloadFlag(flag);
      } catch (err) {
        console.error(`[main] Failed to download flag: ${flag}`, err);
        // Continue downloading others, but mark as error
      }
    }
    console.log("All flags attempted and index.json updated!");
  } catch (err) {
    console.error("Error downloading flags:", err);
    process.exit(1);
  }
})();
