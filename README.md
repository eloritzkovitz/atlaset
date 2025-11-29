# Atlaset

A fully-configurable country explorer built with React, Vite, and TypeScript. Atlaset supports user-defined overlays, flexible filters, trip management and marker placement, allowing users to manage travel logs or create custom maps.
All map, country and currency data sources are **generic, config-driven and environment-configurable**, loaded from JSON files.  
Supports user-defined overlays, flexible filters, and easy data extension for any dataset.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Documentation](#documentation)
- [Authors](#authors)

## Features

### **Map & Data**
- **Interactive map:** Explore a cuztomizable world map
- **Country details:** View detailed country information
- **Configurable filters:** Filter by region, subregion, sovereignty and overlays
- **Config-driven data:** All sources loaded from JSON files via environment variables
- **Export maps:** Export your maps as SVG or PNG images

### **Overlays & Markers**
- **User=defined overlays:** Create and manage custom map overlays
- **Overlay import/export:** Backup, share, or migrate overlays directly from the UI
- **Markers:** Add, edit, and remove markers on the map for any location

### **Trips**
- **Trip management:** Plan, track, and analyze your travels with flexible trip records
- **Timeline mode:** Track your travels showing visited countries on the map

### **Games**
- **Flag guessing game:** Test your knowledge with an interactive flag quiz

### **User Experience**
- **Accessible design:** All major actions and navigation are keyboard-friendly
- **Modern UI:** Responsive design with Tailwind CSS and icons
- **PWA support:** Install the application as an app on desktop or mobile and use it offline

## Technologies Used

- **React** & **TypeScript** — Modern, strongly-typed UI development
- **Vite** — Fast build tool and development server
- **Tailwind CSS** — Utility-first CSS framework for responsive, modern design
- **PWA (Progressive Web App)** — Offline support and installability
- **Jest / Vitest** — Testing frameworks for unit and integration tests
- **Cypress** — End-to-end testing for user flows

## Documentation

- [Getting started](docs/getting-started.md)
- [Data Sources](docs/data-sources.md)
- [Overlays](overlays.md)
- [Trips](trips.md)
- [Keyboard Shortcuts](docs/keyboard-shortcuts.md)

## Authors

- [Elor Itzkovitz](https://github.com/eloritzkovitz)
