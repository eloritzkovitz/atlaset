/**
 * Usage:
 *   npx ts-node scripts/generate-keyboard-shortcuts-table.ts > docs/keyboard-shortcuts.md
 *
 * This script generates a Markdown table of keyboard shortcuts from the keyCommands config.
 */

import { keyCommands } from "../src/shared/constants/keyCommands.ts";
import type { KeyCommand } from "../src/shared/types/keyboard.ts";

/**
 * Generate a Markdown table of keyboard shortcuts from the keyCommands config.
 * @param cmd The key command object.
 * @returns A formatted string representing the key command.
 */
function formatKey(cmd: KeyCommand): string {
  return (
    (cmd.modifiers.length ? cmd.modifiers.join(" + ") + " + " : "") + cmd.key
  );
}

// Generate Markdown table
let md = "# Keyboard Shortcuts\n\n";
md += "| Key(s) | Action | Category |\n|--------|--------|----------|\n";
keyCommands.forEach((cmd) => {
  md += `| \`${formatKey(cmd)}\` | ${cmd.action} | ${cmd.category} |\n`;
});

console.log(md);
