/**
 * Generates React flag components from SVGs using SVGR and extracts aspect ratios.
 */

import { execSync } from "child_process";
import {
  readdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  rmSync,
  renameSync,
} from "fs";
import { join } from "path";

// Utility to extract aspect ratio from SVG string
function extractSvgAspectRatio(svgContent: string): number | null {
  const widthMatch = svgContent.match(/width=["'](\d+(?:\.\d+)?)["']/);
  const heightMatch = svgContent.match(/height=["'](\d+(?:\.\d+)?)["']/);
  if (widthMatch && heightMatch) {
    const width = parseFloat(widthMatch[1]);
    const height = parseFloat(heightMatch[1]);
    if (width > 0 && height > 0) {
      return width / height;
    }
  }
  const viewBoxMatch = svgContent.match(/viewBox=["']([\d\.\s]+)["']/);
  if (viewBoxMatch) {
    const parts = viewBoxMatch[1].split(/\s+/);
    if (parts.length === 4) {
      const vbWidth = parseFloat(parts[2]);
      const vbHeight = parseFloat(parts[3]);
      if (vbWidth > 0 && vbHeight > 0) {
        return vbWidth / vbHeight;
      }
    }
  }
  return null;
}

// Read the index.json to get the list of flags
const indexJson = JSON.parse(readFileSync("flags/index.json", "utf8"));

const RATIOS = ["original", "3x2"];
const FLAGS_BASE = "flags";
const SRC_BASE = "src";

for (const ratio of RATIOS) {
  const flagsDir = join(FLAGS_BASE, ratio);
  const outDir = join(SRC_BASE, ratio);
  if (!existsSync(flagsDir)) {
    console.warn(`Warning: ${flagsDir} does not exist, skipping.`);
    continue;
  }
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  // Clean output dir (remove old .tsx files)
  for (const file of readdirSync(outDir)) {
    if (file.endsWith(".tsx")) {
      rmSync(join(outDir, file));
    }
  }

  // Collect all SVGs for this ratio that exist in indexJson
  const svgFiles = indexJson
    .map((code: string) => join(flagsDir, `${code}.svg`))
    .filter((svgFile: string) => existsSync(svgFile));

  if (svgFiles.length === 0) {
    console.warn(
      `No SVGs found for ratio '${ratio}', skipping index.ts generation.`,
    );
    continue;
  }

  // Run SVGR once for all SVGs in this ratio (output will be PascalCase)
  execSync(
    `npx @svgr/cli --icon --typescript --out-dir "${outDir}" ${svgFiles
      .map((f: string) => '"' + f + '"')
      .join(" ")}`,
    { stdio: "inherit" },
  );

  // After SVGR, rename all .tsx files in outDir to ALL UPPERCASE for the base name, but keep the extension as .tsx
  for (const file of readdirSync(outDir)) {
    if (file.endsWith(".tsx")) {
      // Remove hyphens and uppercase for the new file name
      const base = file.slice(0, -4);
      const upper = base.replace(/-/g, "").toUpperCase() + ".tsx";
      if (file !== upper) {
        const from = join(outDir, file);
        const to = join(outDir, upper);
        // On Windows, if only the case differs, need to rename to a temp file first
        if (from.toLowerCase() === to.toLowerCase()) {
          const temp = join(
            outDir,
            `__temp__${Math.random().toString(36).slice(2)}.tsx`,
          );
          renameSync(from, temp);
          renameSync(temp, to);
        } else {
          if (existsSync(to)) rmSync(to);
          renameSync(from, to);
        }
      }
    }
  }

  // Generate index.ts for this ratio (all exports use uppercase names)
  const indexLines = indexJson
    .filter((code: string) =>
      existsSync(join(outDir, `${code.replace(/-/g, "").toUpperCase()}.tsx`)),
    )
    .map((code: string) => {
      const name = code.replace(/-/g, "").toUpperCase();
      return `export { default as ${name} } from './${name}.js';`;
    });
  writeFileSync(join(outDir, "index.ts"), indexLines.join("\n") + "\n", "utf8");
}
