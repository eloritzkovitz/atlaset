import fs from "fs";
import path from "path";
import https from "https";

// Configuration
const BACKEND_URL =
  process.env.VITE_FLAG_DATA_URL || "https://your-backend.com/flags";
const DEST_DIR = path.join(__dirname, "../public/flags");

fs.mkdirSync(DEST_DIR, { recursive: true });

/**
 * Fetch the list of available flags
 * @returns - Promise that resolves to an array of flag ISO codes
 */
function fetchList() {
  return new Promise((resolve, reject) => {
    https.get(`${BACKEND_URL}/index.json`, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(JSON.parse(data)));
      res.on("error", reject);
    });
  });
}

/**
 * Download a flag by its ISO code
 * @param iso - ISO country code
 * @returns Promise that resolves when the flag is downloaded
 */
function downloadFlag(iso) {
  const filename = iso.endsWith('.svg') ? iso : `${iso}.svg`;
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

// Download all flags
fetchList()
  .then((flags) => Promise.all(flags.map(downloadFlag)))
  .then(() => console.log("All flags downloaded!"))
  .catch((err) => {
    console.error("Error downloading flags:", err);
    process.exit(1);
  });
