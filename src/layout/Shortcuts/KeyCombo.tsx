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
          <kbd className="px-2 py-1 bg-input border border-gray-400 dark:border-gray-500 rounded text-sm font-mono shadow-sm select-none">
            {displayKey(key)}
          </kbd>
          {i < keys.length - 1 && (
            <span className="px-1 text-muted select-none">
              +
            </span>
          )}
        </React.Fragment>
      ))}
    </span>
  );
}
