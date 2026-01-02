/**
 * Prebuild script to fetch necessary data before building the project.
 * Runs fetch-flags.js, fetch-country-data.js, and fetch-geodata.js sequentially.
 */

import execSync from "child_process";

/**
 * Runs a given script using Node.js.
 * @param script - The script file to run.
 */
function runScript(script) {
  try {
    console.log(`Running ${script}...`);
    execSync(`node ${script}`, { stdio: "inherit" });
  } catch (err) {
    console.error(`Error running ${script}:`, err);
    process.exit(1);
  }
}

// Run the fetch scripts sequentially
runScript("scripts/data/fetch-flags.js");
runScript("scripts/data/fetch-country-data.js");
runScript("scripts/data/fetch-geodata.js");

console.log("All fetch scripts completed.");
