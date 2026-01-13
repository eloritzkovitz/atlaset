/**
 * Utility functions for fetching and managing local/remote data files.
 */

import fs from "fs";
import path from "path";
import https from "https";

/**
 * Fetch a remote file as a string, with retries for cold start/transient errors
 * @param {string} url - The full URL to fetch
 * @param {number} retries - Number of attempts
 * @param {number} delayMs - Delay between attempts (ms)
 * @returns {Promise<string>}
 */
export async function fetchWithRetries(url, retries = 5, delayMs = 2000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await new Promise((resolve, reject) => {
        https
          .get(url, (res) => {
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
              if (res.statusCode !== 200) {
                reject(new Error(`Failed to fetch ${url}: ${res.statusCode}`));
              } else {
                resolve(data);
              }
            });
            res.on("error", reject);
          })
          .on("error", reject);
      });
    } catch (err) {
      console.error(
        `[fetchWithRetries] ${url} attempt ${attempt} failed:`,
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

/**
 * Ensure a directory exists (recursive)
 */
export function ensureDirExists(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

/**
 * Read a local file as a string, or null if not present
 */
export function readLocalFile(dir, filename) {
  const localPath = path.join(dir, filename);
  if (!fs.existsSync(localPath)) return null;
  return fs.readFileSync(localPath, "utf8");
}

/**
 * Write data to a local file
 */
export function writeLocalFile(dir, filename, data) {
  fs.writeFileSync(path.join(dir, filename), data);
}
