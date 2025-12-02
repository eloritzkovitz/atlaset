import React from "react";
import {
  FaArrowUp,
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa6";

// Helper to render keys and modifiers
function displayKey(key: string) {
  switch (key) {
    case "ArrowUp":
      return <FaArrowUp />;
    case "ArrowDown":
      return <FaArrowDown />;
    case "ArrowLeft":
      return <FaArrowLeft />;
    case "ArrowRight":
      return <FaArrowRight />;
    case "Shift":
      return <span>⇧</span>;    
    case "Meta":
      return <span>⌘</span>;
    case "Enter":
      return <span>⏎</span>;    
    default:
      return key.length === 1 ? key.toLowerCase() : key;
  }
}

export function KeyCombo({ keys }: { keys: string[] }) {
  return (
    <span className="inline-flex gap-2 justify-center">
      {keys.map((key, i) => (
        <React.Fragment key={key + i}>
          <kbd className="px-2 py-1 bg-gray-200 border border-gray-400 rounded text-sm font-mono shadow-sm text-gray-800 select-none dark:text-gray-200 dark:bg-gray-600 dark:border-gray-500">
            {displayKey(key)}
          </kbd>
          {i < keys.length - 1 && (
            <span className="px-1 text-gray-600 dark:text-gray-400 select-none">
              +
            </span>
          )}
        </React.Fragment>
      ))}
    </span>
  );
}
