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

### **Authentication**
- **User accounts:** Sign in with Google to sync your data across devices
- **Cloud sync:** All trips, overlays, markers, and settings are securely stored in the cloud (Firebase)
- **Guest mode:** Use the app without signing in; migrate your data to your account anytime
- **Offline support:** All data is available offline for guests and authenticated users (via IndexedDB and Firestore persistence)

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
- **Trip management:** Plan, track, and recall your travels with flexible trip records
- **Timeline mode:** Track your travels showing visited countries on the map

### **Games**
- **Flag guessing game:** Test your knowledge with an interactive flag quiz

### **Dashboard**
- **Dashboard:** View and analyze your visits and travels with interactive statistics 

### **User Experience**
- **Accessible design:** All major actions and navigation are keyboard-friendly
- **Modern UI:** Responsive design with Tailwind CSS and icons
- **PWA support:** Install Atlaset as an app on desktop or mobile and use it offline
- **Desktop app:** Run Atlaset as a cross-platform desktop application with Electron

## Technologies Used

- **React** & **TypeScript** — Modern, strongly-typed UI development
- **Vite** — Fast build tool and development server
- **Tailwind CSS** — Utility-first CSS framework for responsive, modern design
- **Firebase (Firestore & Auth)** — Secure cloud database and authentication
- **IndexedDB (via Dexie.js)** — Local/offline storage for guest users and offline mode
- **PWA (Progressive Web App)** — Offline support and installability
- **Electron** — Desktop wrapper for cross-platform app support
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
