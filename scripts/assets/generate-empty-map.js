import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import {
  parseArgs,
  parseValue,
  readJson,
  writeJson,
  ensureDirFor,
} from "../lib/utils.js";

/**
 * Generates a JSON file mapping keys from an input JSON file to a default value.
 * Usage:
 *   node generate-empty-map.js --file=path/to/input.json --key=fieldName --out=path/to/output.json --format=object|array --default=value
 * Example:
 *  node generate-empty-map.js --file=public/data/countries.json --key=isoCode --out=scripts/data/empty-map.json --format=object --default=null
 * Options:
 * --file, -f: Path to input JSON file (default: public/data/countries.json)
 * --key, -k: The field name to use as keys in the output map (default: isoCode)
 * --out, -o: Path to output JSON file (default: scripts/data/empty-map.json)
 * --format: Output format, either "object" for a key-value map or "array" for an array of {key, value} objects (default: object)
 * --default, -d: The default value to assign to each key in the output map (default: null)
 * --dry-run: Perform a dry run without writing the output file (default: false)
 */

function main() {
  const args = parseArgs();
  const file = args.file || args.f || "public/data/countries.json";
  const key = args.key || args.k || "isoCode";
  const outFile = args.out || args.o || "scripts/data/empty-map.json";
  const format = (args.format || "object").toLowerCase(); // 'object' or 'array'
  const defaultRaw = args["default"] || args.d;
  const defaultValue = parseValue(defaultRaw);
  const dryRun = args["dry-run"] || args.dry || false;
  const overwrite = !!(args.overwrite || args.w);

  let data;
  try {
    data = readJson(file);
  } catch (e) {
    console.error(e.message);
    process.exit(2);
  }

  const items = Array.isArray(data) ? data : [data];

  // Validate format
  if (format === "object") {
    const map = {};
    for (const it of items) {
      const k =
        it && Object.prototype.hasOwnProperty.call(it, key)
          ? it[key]
          : undefined;
      if (k !== undefined) map[k] = defaultValue;
    }

    if (dryRun) {
      console.log(
        "Dry run — would write object map with",
        Object.keys(map).length,
        "keys to",
        outFile,
      );
      process.exit(0);
    }

    try {
      writeJson(outFile, map, { backup: false, overwrite });
      console.log("Wrote", outFile, "with", Object.keys(map).length, "keys");
      process.exit(0);
    } catch (e) {
      console.error(e.message);
      process.exit(4);
    }
  }

  if (format === "array") {
    const arr = [];
    for (const it of items) {
      const k =
        it && Object.prototype.hasOwnProperty.call(it, key)
          ? it[key]
          : undefined;
      if (k !== undefined) arr.push({ [key]: k, value: defaultValue });
    }

    if (dryRun) {
      console.log(
        "Dry run — would write array map with",
        arr.length,
        "entries to",
        outFile,
      );
      process.exit(0);
    }

    try {
      writeJson(outFile, arr, { backup: false, overwrite });
      console.log("Wrote", outFile, "with", arr.length, "entries");
      process.exit(0);
    } catch (e) {
      console.error(e.message);
      process.exit(4);
    }
  }

  console.error("Unknown format:", format);
  process.exit(5);
}

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) main();
