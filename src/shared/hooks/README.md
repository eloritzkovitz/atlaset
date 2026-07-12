# hooks/

This folder contains shared hooks used by various components across the Atlaset application. Below is an overview of each subfolder and its purpose:

## Folder overview

- [`animation/`](./animation/)  
  Handles visual transitions such as sliding elements or entry/exit movement for smooth UI motion.

- [`data/`](./data/)  
  Manages client-side data calculation and manipulations.

- [`device/`](./device/)  
  Detects hardware environment profiles, such as the user's device or screen size

- [`dom/`](./models/)  
  Provides low-level utilities that interface directly with browser Web APIs, like event listeners and intersection observers.

- [`input/`](./input/)  
  Listens for user actions from inputs such as keyboard and mouse.

- [`markdown/`](./markdown/)  
  Parses and processes raw Markdown text into readable formats.

- [`navigation/`](./navigation/)  
  Coordinates list traversal logic, managing active element focus switching and container scroll boundaries.

- [`overlays/`](./overlays/)  
  Orchestrates floating element components like portals, panels, menus, tooltips and context menus.

- [`state/`](./state/)  
  Encapsulates application state or business logic that is shared across various components.

- [`storage/`](./storage/)  
  Handles browser data persistence, providing serialization wrappers for LocalStorage and SessionStorage.

- [`ui/`](./ui/)  
  Manages interactive layour behaviors and state, such as drag-and-drop and resizable layouts.
