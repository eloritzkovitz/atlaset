# Developer guide

Welcome to **Atlaset!**  
This guide will help you set up the project locally, configure your data sources and run the app for development or production.

## Prerequisites

- **Node.js** (v18 or newer recommended)
- **npm** (v9 or newer recommended)
- **Git** for cloning the repository

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/eloritzkovitz/atlaset.git
   cd `atlaset`
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## Configuration

1. **Environment variables**

Copy the example environment file and adjust the data sources as needed:

```bash
cp .env.example .env
```

2. **Data sources**

See the [data sources guide](/docs/developers/data-sources.md) for information about configuring data sources.

## Running the app

**Development**

Start the development server with:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

**Production build**

Create a production build with:

```bash
npm run build
```

The production files are generated in the `dist` directory.

Before the build is created, Atlaset runs its data synchronization process to fetch and generate the static data used by the application.

The resulting data is included in the production build and served as part of the application. Static data is therefore not fetched from the source datasets at runtime.

**Preview**

Preview the production build locally with:

```bash
npm run preview
```

## Working with data

Atlaset uses static datasets for countries, geographic data, currencies, languages, achievements and other application data.

For production builds, the data synchronization process fetches the configured source data and generates the static assets that are included in the application build.

## Next steps

**Atlaset** is now ready! You can now begin exploring and customizing the application to your interest and liking!
