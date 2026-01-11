/**
 * Script to automatically add or update the sovereigntyType property for each country in countries.json.
 *
 * Usage:
 *   node addSovereigntyType.js [path/to/countries.json] [path/to/customSovereigntyMap.json]
 *
 * - The first argument is the path to your countries.json file (optional).
 * - The second argument is the path to a custom sovereignty mapping JSON file (optional).
 *
 * The sovereignty mapping should be an object where keys are sovereignty types and values are arrays of ISO codes.
 */

const fs = require("fs");
const path = require("path");

// Path to your countries.json file
const filePath =
  process.argv[2] || path.join(__dirname, "../public/data/countries.json");

/**
 * Sovereignty mapping: key = sovereigntyType, value = array of ISO codes.
 * You can fill these arrays directly or provide a custom mapping JSON file.
 * Example custom mapping file:
 * {
 *   "sovereign": ["GB", "FR", ...],
 *   "dependency": ["GI", ...],
 *   "partially recognized": ["TW", ...],
 *   "disputed": ["EH", ...]
 * }
 */
const sovereigntyMap = {
  sovereign: [],
  dependency: [],
  "partially recognized": [],
  disputed: [],
};

// Optionally, allow custom mapping via a JSON file
const customMapPath = process.argv[3];
if (customMapPath && fs.existsSync(customMapPath)) {
  const customMap = JSON.parse(fs.readFileSync(customMapPath, "utf8"));
  Object.assign(sovereigntyMap, customMap);
}

// Read countries.json
const countries = JSON.parse(fs.readFileSync(filePath, "utf8"));

/**
 * Returns the sovereignty type for a given ISO code.
 * @param {string} isoCode - The ISO code of the country.
 * @returns {string} - The sovereignty type ("sovereign", "dependency", "partially recognized", "disputed", or "unknown").
 */
function getSovereigntyType(isoCode) {
  for (const [type, codes] of Object.entries(sovereigntyMap)) {
    if (codes.includes(isoCode)) return type;
  }
  return "unknown";
}

/**
 * Updates each country object with the correct sovereigntyType.
 * @param {Array<Object>} countries - Array of country objects.
 * @returns {Array<Object>} - Updated array of country objects.
 */
const updated = countries.map((country) => ({
  ...country,
  sovereigntyType: getSovereigntyType(country.isoCode),
}));

// Write back to countries.json (pretty-printed)
fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
console.log(`countries.json updated with sovereigntyType! (${filePath})`);
