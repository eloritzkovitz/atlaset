import React from "react";
import {
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp,
} from "react-icons/fa6";
import type { KeyCommand } from "@types";

// Helper to render arrow icons for arrow keys
function renderKey(key: string) {
  switch (key) {
    case "ArrowUp":
      return <FaArrowUp className="inline-block align-middle" />;
    case "ArrowDown":
      return <FaArrowDown className="inline-block align-middle" />;
    case "ArrowLeft":
      return <FaArrowLeft className="inline-block align-middle" />;
    case "ArrowRight":
      return <FaArrowRight className="inline-block align-middle" />;
    default:
      return key.length === 1 ? key.toLowerCase() : key;
  }
}

// Helper to render modifier icons
function renderModifier(mod: string) {
  switch (mod) {
    case "Shift":
      return <span className="inline-block align-middle">⇧</span>;
    default:
      return mod[0] + mod.slice(1);
  }
}

export function ShortcutRow({ cmd }: { cmd: KeyCommand }) {
  return (
    <tr key={cmd.key + cmd.modifiers.join("+")}>
      <td className="py-2 pr-6 min-w-[90px]">
        <span className="inline-flex gap-2 justify-center">
          {cmd.modifiers.map((m: string, i) => (
            <React.Fragment key={m}>
              <kbd className="px-2 py-1 bg-gray-200 border border-gray-400 rounded text-sm font-mono shadow-sm text-gray-800 select-none dark:text-gray-200 dark:bg-gray-600 dark:border-gray-500">
                {renderModifier(m)}
              </kbd>
              <span className="px-1 text-gray-600 dark:text-gray-400 select-none">
                {i === cmd.modifiers.length - 1 ? "+" : ""}
              </span>
            </React.Fragment>
          ))}
          <kbd className="px-2 py-1 bg-gray-200 border border-gray-400 rounded text-sm font-mono shadow-sm text-gray-800 select-none dark:text-gray-200 dark:bg-gray-600 dark:border-gray-500">
            {renderKey(cmd.key)}
          </kbd>
        </span>
      </td>
      <td className="py-1 text-sm text-gray-700 select-none">{cmd.action}</td>
    </tr>
  );
}
