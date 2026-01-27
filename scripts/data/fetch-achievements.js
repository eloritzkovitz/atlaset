/**
 * Fetches achievements data from a remote server and stores it locally.
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

const ACHIEVEMENTS_DATA_URL =
	process.env.VITE_ACHIEVEMENTS_DATA_URL ||
	"https://atlaset-data-server.onrender.com/data/achievements.json";
const DEST_DIR = path.join(__dirname, "../../public/data");

ensureDirExists(DEST_DIR);

const FILENAME = "achievements.json";

// Main logic: only fetch if file changed
(async () => {
	try {
		console.log(`Fetching: ${FILENAME} -> ${ACHIEVEMENTS_DATA_URL}`);
		const remoteRaw = await fetchWithRetries(ACHIEVEMENTS_DATA_URL);
		const localRaw = readLocalFile(DEST_DIR, FILENAME);
		if (localRaw && localRaw === remoteRaw) {
			console.log(`${FILENAME} is up to date. No download needed.`);
			return;
		}
		writeLocalFile(DEST_DIR, FILENAME, remoteRaw);
		console.log(`${FILENAME} downloaded and updated!`);
	} catch (err) {
		console.error("Error downloading achievements data:", err);
		process.exit(1);
	}
})();
