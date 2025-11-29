# Getting Started

Welcome to **Atlaset!**  
This guide will help you set up the project locally, configure your data sources, and run the app for development or production.

## Prerequisites

* Node.js (v18 or newer recommended)
* npm (v9 or newer recommended)
* (Optional) Git for cloning the repository

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/eloritzkovitz/atlaset.git
   cd atlaset
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

## Configuration

1. **Environmental Variables**  

Copy the example environment file and adjust the data sources as needed:
   ```bash
   cp .env.example .env
   ```

2. **Data Sources**  

Atlaset loads map, country, and currency data from JSON files in [public/data](../public/data/).
You can customize these sources or swap datasets by editing the `.env` file.

See [Data Sources](./data-sources.md) for details on file formats and environment variables.

## Running the App

**Start the development server**
   ```bash
   npm run dev
   ```

* Open http://localhost:5173 in your browser.

**Build for production**
   ```bash
   npm run build
   ```

* The output will be in the [/dist](../dist) folder.

**Preview the production build**
   ```bash
   npm run preview
   ```

## Next Steps

**Atlaset** is now ready! You can now begin exploring and customizing the application to your interest and liking!
