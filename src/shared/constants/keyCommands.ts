import type { KeyCommand } from "@types";

export const categoryColumns = [
  ["General", "Search", "Filters", "Friends"],
  ["Toolbar"],
  ["Map", "Timeline"],
  ["Country List"],  
];

export const keyCommands: KeyCommand[] = [
  // General
  { key: "?", modifiers: ["Shift"], action: "Show shortcuts", category: "General" },
  { key: "Esc", modifiers: [], action: "Unfocus / Close", category: "General" },
  
  // Search
  { key: "/", modifiers: [], action: "Focus search", category: "Search" }, 
  
  // Filters
  { key: "r", modifiers: [], action: "Reset filters", category: "Filters" },  

  // Friends
  { key: "n", modifiers: [], action: "Toggle friends panel", category: "Friends" },

  // Toolbar
  { key: "c", modifiers: [], action: "Toggle countries", category: "Toolbar" },
  { key: "e", modifiers: [], action: "Toggle export", category: "Toolbar" },
  { key: "f", modifiers: [], action: "Toggle filters", category: "Toolbar" },
  { key: "l", modifiers: [], action: "Toggle legend", category: "Toolbar" },  
  { key: "m", modifiers: [], action: "Toggle markers", category: "Toolbar" },
  { key: "o", modifiers: [], action: "Toggle overlays", category: "Toolbar" },  
  { key: "s", modifiers: [], action: "Toggle settings", category: "Toolbar" },
  { key: "t", modifiers: [], action: "Toggle timeline", category: "Toolbar" },
  { key: "u", modifiers: [], action: "Toggle UI", category: "Toolbar" },  

  // Map
  { key: "+", modifiers: [], action: "Zoom in", category: "Map" },
  { key: "-", modifiers: [], action: "Zoom out", category: "Map" },
  { key: "0", modifiers: [], action: "Reset zoom", category: "Map" },
  { key: "x", modifiers: [], action: "Center map on country", category: "Map" },

  // Timeline
  { key: "ArrowRight", modifiers: [], action: "Next year", category: "Timeline" },
  { key: "ArrowLeft", modifiers: [], action: "Previous year", category: "Timeline" },
  { key: "Home", modifiers: [], action: "Go to first year", category: "Timeline" },
  { key: "End", modifiers: [], action: "Go to last year", category: "Timeline" },
  { key: "Space", modifiers: [], action: "Play/Pause", category: "Timeline" },

  // Country list
  { key: "ArrowUp", modifiers: [], action: "Scroll up", category: "Country List" },
  { key: "ArrowDown", modifiers: [], action: "Scroll down", category: "Country List" },
  { key: "Home", modifiers: [], action: "Go to first country", category: "Country List" },
  { key: "End", modifiers: [], action: "Go to last country", category: "Country List" },
  { key: "PgUp", modifiers: [], action: "Scroll up one page", category: "Country List" },
  { key: "PgDn", modifiers: [], action: "Scroll down one page", category: "Country List" },
  { key: "Enter", modifiers: [], action: "Select country", category: "Country List" },
];