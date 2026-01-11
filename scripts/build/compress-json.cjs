
/**
 * Compresses a GeoJSON file by removing whitespace and indentation.
 */

const fs = require("fs");
const path = require("path");

// Use paths relative to the project root
const inputPath = path.join(__dirname, "..", "public", "data", "countries.geojson");
const outputPath = path.join(__dirname, "..", "public", "data", "countries.min.geojson");

// Read, compress, and write the JSON file
const data = JSON.parse(fs.readFileSync(inputPath, "utf8"));
fs.writeFileSync(outputPath, JSON.stringify(data));

console.log(`Compressed ${inputPath} to ${outputPath}`);