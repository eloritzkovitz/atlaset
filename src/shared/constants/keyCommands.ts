import type { KeyCommand } from "@types";

export const categoryColumns = [
  ["General", "User"],
  ["Atlas"],
  ["Countries"],
  ["Map", "Timeline"],
];

export const keyCommands: KeyCommand[] = [
  // General
  {
    key: "?",
    modifiers: ["Shift"],
    action: "Show shortcuts",
    category: "General",
  },
  { key: "/", modifiers: [], action: "Focus search", category: "General" },
  { key: "Esc", modifiers: [], action: "Unfocus / Close", category: "General" },
  { key: "h", modifiers: [], action: "Toggle help", category: "General" },
  { key: "r", modifiers: [], action: "Reset filters", category: "General" },

  // User
  {
    key: "n",
    modifiers: [],
    action: "Toggle friends",
    category: "User",
  },

  // Atlas
  { key: "b", modifiers: [], action: "Toggle saved maps", category: "Atlas" },
  { key: "c", modifiers: [], action: "Toggle countries", category: "Atlas" },
  { key: "e", modifiers: [], action: "Toggle export", category: "Atlas" },
  { key: "f", modifiers: [], action: "Toggle filters", category: "Atlas" },
  { key: "g", modifiers: [], action: "Toggle legend", category: "Atlas" },
  { key: "l", modifiers: [], action: "Toggle layers", category: "Atlas" },
  { key: "m", modifiers: [], action: "Toggle markers", category: "Atlas" },
  { key: "o", modifiers: [], action: "Toggle overlays", category: "Atlas" },
  { key: "s", modifiers: [], action: "Toggle settings", category: "Atlas" },
  { key: "t", modifiers: [], action: "Toggle timeline", category: "Atlas" },
  { key: "u", modifiers: [], action: "Toggle UI", category: "Atlas" },

  // Countries
  {
    key: "ArrowUp",
    modifiers: [],
    action: "Scroll up",
    category: "Countries",
  },
  {
    key: "ArrowDown",
    modifiers: [],
    action: "Scroll down",
    category: "Countries",
  },
  {
    key: "Home",
    modifiers: [],
    action: "Go to first country",
    category: "Countries",
  },
  {
    key: "End",
    modifiers: [],
    action: "Go to last country",
    category: "Countries",
  },
  {
    key: "PgUp",
    modifiers: [],
    action: "Scroll up one page",
    category: "Countries",
  },
  {
    key: "PgDn",
    modifiers: [],
    action: "Scroll down one page",
    category: "Countries",
  },
  {
    key: "Enter",
    modifiers: [],
    action: "Select country",
    category: "Countries",
  },

  // Map
  { key: "+", modifiers: [], action: "Zoom in", category: "Map" },
  { key: "-", modifiers: [], action: "Zoom out", category: "Map" },
  { key: "0", modifiers: [], action: "Reset zoom", category: "Map" },
  { key: "x", modifiers: [], action: "Center map on country", category: "Map" },

  // Timeline
  {
    key: "ArrowRight",
    modifiers: [],
    action: "Next year",
    category: "Timeline",
  },
  {
    key: "ArrowLeft",
    modifiers: [],
    action: "Previous year",
    category: "Timeline",
  },
  {
    key: "Home",
    modifiers: [],
    action: "Go to first year",
    category: "Timeline",
  },
  {
    key: "End",
    modifiers: [],
    action: "Go to last year",
    category: "Timeline",
  },
  { key: "Space", modifiers: [], action: "Play/Pause", category: "Timeline" },
];
