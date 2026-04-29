/**
 * Cleans non-standard attributes and style properties from .tsx files in the src/original directory.
 * This is useful for removing attributes that are specific to design tools like Inkscape and may not be valid in React components.
 * The script targets attributes like Inkscape-specific ones (e.g., InkscapeStroke) and style properties that are not standard CSS.
 * Usage:
 *   node clean-attributes.js
 */

import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const dir = "src/original";
const files = readdirSync(dir).filter((f) => f.endsWith(".tsx"));

for (const file of files) {
  const filePath = join(dir, file);
  let code = readFileSync(filePath, "utf8");
  // Remove non-standard JSX attributes
  code = code.replace(
    /\s(?:Inkscape\w+|inkscape:[\w-]+|sodipodi:[\w-]+|xmlns:inkscape|xmlns:sodipodi)="[^"]*"/gi,
    "",
  );
  // Remove non-standard style object properties
  code = code.replace(
    /(?:InkscapeStroke|shapePadding|InkscapeFontSpecification|solidColor|solidOpacity|enableBackground|writingMode|imageRendering):\s*(?:(?:["'][^"']*["'])|(?:[0-9.]+)),?/gi,
    "",
  );
  // Remove object properties in style objects
  code = code.replace(/InkscapeStroke:\s*["'][^"']*["'],?/gi, "");
  code = code.replace(/enableBackground:\s*["'][^"']*["'],?/gi, "");
  code = code.replace(/writingMode:\s*["'][^"']*["'],?/gi, "");
  code = code.replace(/imageRendering:\s*["'][^"']*["'],?/gi, "");
  // Remove direct props
  code = code.replace(/\s*enableBackground="[^"]*"/gi, "");
  code = code.replace(/\s*writingMode="[^"]*"/gi, "");
  code = code.replace(/\s*imageRendering="[^"]*"/gi, "");
  writeFileSync(filePath, code, "utf8");
}

console.log(
  "Cleaned non-standard attributes and style properties from .tsx files in src/original.",
);
