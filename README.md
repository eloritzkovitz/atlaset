# Atlaset

Atlaset is a modern, interactive country explorer and travel tracker built with React, Vite and TypeScript. Designed for flexibility and performance, Atlaset allows fellow travelers to manage travel logs and analyze their journeys around the world - centered around an immersive map and powerful, rich features: tinker with the map and add your own layers and markers, reminisce past trips with the timeline or plan new adventures, view the dashboard or test your knowledge of the world!

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Documentation](#documentation)
- [Authors](#authors)

## Features

### **Users & Data**

- **User accounts:** Sign in with Google to sync your data across devices
- **Cloud sync:** All user data is securely stored in the cloud (Firebase)
- **Guest mode:** Use the app without signing in; migrate your data to your account anytime
- **Offline support:** All data is available offline for guests and authenticated users (via IndexedDB and Firestore persistence)

### **Atlas**

- **Interactive map:** Explore a customizable world map with detailed country information and dynamic filters
- **Timeline mode:** Track your travel history on the map
- **Custom maps:** Create, import, export and manage your own maps, layers and markers
- **Export maps:** Export your maps as images or backup your entire data as JSON
- **Share maps:** Instantly share your maps via s a special URL
- **Embed maps:** Embed maps directly into your website using a customized HTML iframe.

### **Trips**

- **Trip management:** Plan, track and recall your travels with flexible trip records
- **Calendar:** View your trips and events in the calendar

### **Dashboard**

- **Exploration:** Track your exploration of the world
- **Achievements:** Earn personal achievements as you explore the world and interact with the application
- **Statistics:** View and analyze your visits and travels with interactive statistics

### **Quizzes**

- **Competitive quizzes:** Timed challenges to test your speed and accuracy against the clock
- **Progress tracking:** See your scores, streaks and improvements over time
- **Leaderboards:** Compare your results with other users and climb the ranks

### **User Experience**

- **Accessible design:** All major actions and navigation are keyboard-friendly
- **Modern UI:** Responsive design with Tailwind CSS and icons
- **PWA support:** Install Atlaset as an app on desktop or mobile and use it offline
- **Desktop app:** Run Atlaset as a cross-platform desktop application with Electron

### **Social Features**

- **User Profiles:** Show your personal information and milestones
- **Friends:** Add other users as friends, allowing you to interact and share content

## Technologies Used

### Frontend

- **React & TypeScript** — Modern, strongly-typed UI development
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
- **Vercel & Render** — Frontend/backend API hosting

### Testing

- **Vitest** — Testing frameworks for unit and integration tests
- **Testing Library** — Testing framework for React components and hooks
- **Cypress** — End-to-end testing for user flows

## Documentation

- [Read the full documentation](https://atlaset.vercel.app/docs)

## Authors

- [Elor Itzkovitz](https://github.com/eloritzkovitz)
