/**
 * Fetches country flags from a remote server and stores them locally.
 * The script retrieves a list of available flags and downloads each one
 * into the specified directory.
 */

import "dotenv/config";
import fs from "fs";
import path from "path";
import https from "https";
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

const FLAGS_URL = `${DATA_URL}/flags`;
const DEST_DIR = path.join(__dirname, "../../public/flags");

ensureDirExists(DEST_DIR);

/**
 * Fetch the remote index.json as a string, with retries
 * @returns Promise that resolves to the raw index.json string
 */
async function fetchRemoteIndex(retries = 5, delayMs = 2000) {
  const url = `${FLAGS_URL}/index.json`;
  return fetchWithRetries(url, retries, delayMs);
}

/**
 * Download a flag by its ISO code, with retries and error logging
 * @param iso - ISO country code
 * @returns Promise that resolves when the flag is downloaded
 */
async function downloadFlag(iso, retries = 5, delayMs = 2000) {
  const filename = iso.endsWith(".svg") ? iso : `${iso}.svg`;
  const dest = path.join(DEST_DIR, filename);
  if (fs.existsSync(dest)) {
    return; // Skip if already exists
  }
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await new Promise((resolve, reject) => {
        const url = `${FLAGS_URL}/${filename}`;
        const file = fs.createWriteStream(dest);
        https
          .get(url, (response) => {
            if (response.statusCode !== 200) {
              file.close();
              fs.unlink(dest, () => {}); // Clean up partial file
              return reject(
                new Error(`Failed to fetch ${url}: ${response.statusCode}`),
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
        err,
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
    const localIndexRaw = readLocalFile(DEST_DIR, "index.json");
    if (localIndexRaw && localIndexRaw === remoteIndexRaw) {
      console.log("[fetch-flags] Flags are up to date. No download needed.");
      return;
    }
    console.log(
      "[fetch-flags] index.json changed or missing, downloading flags...",
    );
    // Save new index.json
    writeLocalFile(DEST_DIR, "index.json", remoteIndexRaw);
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
