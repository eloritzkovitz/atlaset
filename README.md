# Atlaset

Atlaset is a modern, interactive country explorer and travel tracker built with React, Vite, and TypeScript. Designed for flexibility and performance, Atlaset allows fellow travelers to manage travel logs and analyze their journeys around the world - centered around an immersive map and powerful, rich features: tinker with the map and add your own overlays and markers, reminisce past trips with the timeline or plan new adventures, view the dashboard or test your knowledge of the world!

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
- **Interactive map:** Explore a customizable world map
- **Country details:** View detailed country information
- **Configurable filters:** Filter by region, subregion, sovereignty and overlays
- **Config-driven data:** All sources loaded from JSON files via environment variables
- **Export maps:** Export your maps as SVG or PNG images

### **Overlays & Markers**
- **User-defined overlays:** Create and manage custom map overlays
- **Overlay import/export:** Backup, share, or migrate overlays directly from the UI
- **Markers:** Add, edit, and remove markers on the map for any location

### **Trips**
- **Trip management:** Plan, track, and recall your travels with flexible trip records
- **Timeline mode:** Track your travels showing visited countries on the map

### **Quizzes**
- **Competitive quizzes:** Timed challenges to test your speed and accuracy against the clock
- **Progress tracking:** See your scores, streaks, and improvements over time
- **Leaderboard:** Compare your results with other users and climb the ranks

### **Dashboard**
- **Dashboard:** View and analyze your visits and travels with interactive statistics 

### **User Experience**
- **Accessible design:** All major actions and navigation are keyboard-friendly
- **Modern UI:** Responsive design with Tailwind CSS and icons
- **PWA support:** Install Atlaset as an app on desktop or mobile and use it offline
- **Desktop app:** Run Atlaset as a cross-platform desktop application with Electron

## Technologies Used

### Frontend
- **React** & **TypeScript** — Modern, strongly-typed UI development
- **Redux Toolkit** — Predictable state management
- **Vite** — Fast build tool and development server
- **Tailwind CSS** — Utility-first CSS framework for responsive, modern design

### Backend
- **Node.js** — Backend API and data processing
- **Express** — API routing

### Storage & Data
- **Firebase (Firestore & Auth)** — Secure cloud database and authentication
- **IndexedDB (via Dexie.js)** — Local/offline storage and caching for guest sessions

### Platform & Deployment
- **PWA (Progressive Web App)** — Offline support and installability
- **Electron** — Desktop wrapper for cross-platform app support
- **Deployed via Vercel** — Frontend hosting
- **Deployed via Render** — Backend/API hosting

### Testing
- **Jest / Vitest** — Testing frameworks for unit and integration tests
- **Testing Library** — Testing framework for React components and hooks
- **Cypress** — End-to-end testing for user flows

## Documentation

- [Getting started](docs/getting-started.md)
- [Data Sources](docs/data-sources.md)
- [Overlays](docs/overlays.md)
- [Trips](docs/trips.md)
- [Keyboard Shortcuts](docs/keyboard-shortcuts.md)

## Authors

- [Elor Itzkovitz](https://github.com/eloritzkovitz)
