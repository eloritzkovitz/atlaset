import * as fs from "fs";
import * as path from "path";

/**
 * Parses command-line arguments in the form of --key=value or --key value.
 * Handles flags (boolean) and key-value pairs.
 * @returns An object containing the parsed arguments
 */
export function parseArgs() {
  const out = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const [k, v] = a.slice(2).split("=");
    if (v !== undefined) out[k] = v;
    else {
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        out[k] = next;
        i++;
      } else out[k] = true;
    }
  }
  return out;
}

/**
 * Parses a string value, attempting to convert it to JSON if possible
 * @param {*} str - The string to parse.
 * @returns The parsed value, or the original string if JSON parsing fails. Returns undefined if input is undefined.
 */
export function parseValue(str) {
  if (str === undefined) return undefined;
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}

/**
 * Reads a JSON file and returns its parsed content.
 * @param {*} filePath - The path to the JSON file.
 * @returns The parsed JSON content.
 */
export function readJson(filePath) {
  const abs = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(abs)) throw new Error(`File not found: ${abs}`);
  const raw = fs.readFileSync(abs, "utf8");
  return JSON.parse(raw);
}

/**
 * Ensures that the directory for a given file path exists, creating it if necessary.
 * @param {*} filePath - The file path for which to ensure the directory exists.
 */
export function ensureDirFor(filePath) {
  const dir = path.dirname(path.resolve(process.cwd(), filePath));
  fs.mkdirSync(dir, { recursive: true });
}

/**
 * Writes an object as JSON to a file, with options for backup and overwrite.
 * @param {*} filePath - The path to the output JSON file.
 * @param {*} data - The data to write to the file.
 * @param {*} opts - Options for writing the file, including:
 *  - backup (boolean): Whether to create a backup of the existing file (default: true).
 *  - overwrite (boolean): Whether to overwrite the file if it already exists (default: true).
 *  - indent (number): The number of spaces to use for indentation in the output JSON (default: 2).
 * @throws Will throw an error if the file exists and overwrite is false.
 * @throws Will throw an error if the file cannot be written for any reason.
 */
export function writeJson(filePath, data, opts = {}) {
  const { backup = true, overwrite = true, indent = 2 } = opts;
  const abs = path.resolve(process.cwd(), filePath);
  ensureDirFor(abs);
  if (fs.existsSync(abs) && backup) {
    const bname = `${abs}.bak.${Date.now()}`;
    fs.copyFileSync(abs, bname);
  }
  if (fs.existsSync(abs) && !overwrite) {
    throw new Error(`File exists and overwrite=false: ${abs}`);
  }
  fs.writeFileSync(abs, JSON.stringify(data, null, indent) + "\n", "utf8");
}

/**
 * Builds a lookup object from a raw mapping, which can be either an array or an object.
 * If the raw mapping is an array, mapFrom and mapTo options are required to specify the keys to use for the lookup.
 * If the raw mapping is already an object, it is returned as-is.
 * @param {*} rawMap - The raw mapping data, either an array of objects or an object.
 * @param {*} opts - Options for building the lookup, including:
 *  - mapFrom (string): The key to use for the lookup keys when rawMap is an array.
 *  - mapTo (string): The key to use for the lookup values when rawMap is an array.
 * @throws Will throw an error if rawMap is an array and mapFrom or mapTo is not provided.
 * @returns A lookup object built from the raw mapping data.
 */
export function buildLookup(rawMap, opts = {}) {
  const { mapFrom, mapTo } = opts;
  if (Array.isArray(rawMap)) {
    if (!mapFrom || !mapTo)
      throw new Error("mapFrom and mapTo required for array map");
    const lookup = {};
    for (const item of rawMap) {
      if (item[mapFrom] !== undefined) lookup[item[mapFrom]] = item[mapTo];
    }
    return lookup;
  }
  return rawMap || {};
}

/**
 * Retrieves a value from an object at a specified path, where the path is a dot-separated string.
 * If the path does not exist, returns undefined.
 * @param {*} obj - The object from which to retrieve the value.
 * @param {*} pathStr - The dot-separated string representing the path to the desired value.
 * @returns The value at the specified path, or undefined if the path does not exist.
 */
export function getAtPath(obj, pathStr) {
  if (!pathStr) return undefined;
  const parts = pathStr.split(".");
  let t = obj;
  for (const p of parts) {
    if (t == null) return undefined;
    t = t[p];
  }
  return t;
}

/**
 * Sets a value on an object at a specified path, where the path is a dot-separated string.
 * @param {*} obj - The object on which to set the value.
 * @param {*} pathStr - The dot-separated string representing the path where the value should be set.
 * @param {*} value - The value to set at the specified path.
 * @param {*} skipExisting - If true, the function will not overwrite existing values at the path and will return false instead. Default is false (will overwrite).
 * @returns A boolean indicating whether the value was successfully set.
 */
export function setAtPath(obj, pathStr, value, skipExisting) {
  if (!pathStr) return false;
  const parts = pathStr.split(".");
  let target = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (target[p] === undefined || typeof target[p] !== "object")
      target[p] = {};
    target = target[p];
  }
  const last = parts[parts.length - 1];
  if (skipExisting && Object.prototype.hasOwnProperty.call(target, last))
    return false;
  target[last] = value;
  return true;
}
