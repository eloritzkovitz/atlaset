import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import {
  parseArgs,
  parseValue,
  readJson,
  writeJson,
  buildLookup,
  getAtPath,
  setAtPath,
} from "../lib/utils.js";

/**
 * Adds a new field to each object in a JSON file, values supplied from a mapping file.
 * Usage:
 *   node add-field.js --file=path/to/file.json --path=field.path --map=path/to/map.json
 * Example:
 *   node add-field.js --file=public/data/countries.json --path=regionGroup --map=scripts/data/region-map.json
 * Options:
 *  --file, -f: Path to JSON file (default: public/data/countries.json)
 *  --path, -k: Path to the field to add (default: undefined)
 *  --map, -m: Path to JSON mapping file (required: supplies per-item values)
 *  --dry-run, -d: Perform a dry run without modifying the file (default: false)
 *  --backup, -b: Create a backup of the original file (default: true)
 *  --skip-existing, --skip: Skip fields that already exist (default: false)
 * Notes:
 *  - The field path can be nested using dot notation (e.g., "info.population").
 *  - Mapping file may be either an object lookup or an array convertible with --mapFrom/--mapTo.
 *  - The script will handle both arrays of objects and single objects at the root of the JSON file.
 */

function main() {
  const args = parseArgs();
  const file = args.file || args.f || "public/data/countries.json";
  const fieldPath = args.path || args.key || args.k;
  const mapPath = args.map || args.m;
  const mapKeyField =
    args.mapKeyField ||
    args.mapKey ||
    args.mapKey ||
    args.mapKeyField ||
    "isoCode";
  const mapFrom = args.mapFrom;
  const mapTo = args.mapTo;
  const mapDefaultRaw = args.mapDefault;
  const mapSkipMissing =
    args["map-skip-missing"] || args.mapSkipMissing || false;
  const dryRun = args["dry-run"] || args.dry || false;
  const backup = args.backup === undefined ? true : !!args.backup;
  const skipExisting = args["skip-existing"] || args["skip"] || false;

  // Validate required arguments
  if (!fieldPath) {
    console.error("Missing --path (field path)");
    process.exit(2);
  }

  if (!mapPath) {
    console.error(
      "Missing --map (mapping file). This script requires a mapping file to supply per-item values.",
    );
    process.exit(2);
  }

  // Load the target JSON file
  let data;
  try {
    data = readJson(file);
  } catch (e) {
    console.error(e.message);
    process.exit(4);
  }

  // Load the mapping file and build the lookup
  let mapping = null;
  let mapDefault = undefined;
  try {
    const rawMap = readJson(mapPath);
    mapping = buildLookup(rawMap, { mapFrom, mapTo });
    if (mapDefaultRaw !== undefined) mapDefault = parseValue(mapDefaultRaw);
  } catch (e) {
    console.error(e.message);
    process.exit(6);
  }

  const results = { changed: 0, total: 0 };

  // Process the data, which can be either an array of objects or a single object
  if (Array.isArray(data)) {
    results.total = data.length;
    for (let i = 0; i < data.length; i++) {
      let v;
      if (mapping) {
        const lookupKey = getAtPath(data[i], mapKeyField);
        const mapped = mapping[lookupKey];
        if (mapped === undefined) {
          if (mapDefault !== undefined) v = mapDefault;
          else if (mapSkipMissing) continue;
          else continue;
        } else v = mapped;
      }
      const changed = setAtPath(data[i], fieldPath, v, skipExisting);
      if (changed) results.changed++;
    }
  } else if (typeof data === "object" && data !== null) {
    results.total = 1;
    let v;
    if (mapping) {
      const lookupKey = getAtPath(data, mapKeyField);
      const mapped = mapping[lookupKey];
      if (mapped === undefined) {
        if (mapDefault !== undefined) v = mapDefault;
        else if (mapSkipMissing) {
          // no change
        }
      } else v = mapped;
    }
    const changed = setAtPath(data, fieldPath, v, skipExisting);
    if (changed) results.changed++;
  } else {
    console.error("Unsupported JSON root type (must be object or array)");
    process.exit(5);
  }

  // If dry run, output the results and exit without writing
  if (dryRun) {
    console.log("Dry run — no file written");
    console.log(`Target: ${file}`);
    console.log(`Path: ${fieldPath}`);
    console.log(`Map: ${mapPath}`);
    console.log(`Would change ${results.changed} of ${results.total} items`);
    process.exit(0);
  }

  // Write the modified data back to the file, creating a backup if specified
  try {
    writeJson(file, data, { backup, overwrite: true });
    console.log(
      `Wrote ${file} — changed ${results.changed} of ${results.total} items`,
    );
  } catch (e) {
    console.error("Error writing file:", e.message);
    process.exit(7);
  }
}

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) main();
