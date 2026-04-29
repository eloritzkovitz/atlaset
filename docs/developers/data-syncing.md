# Data Sync & Updates

To automatically fetch and update all static data files (`flags`, `countries`, `currencies`, `geodata`, `achievements`, `documentation`), a prebuild script is provided and run before every build:

```bash
npm run prebuild
```

This script runs all fetch scripts in `scripts/data/` to ensure your static assets are always up to date. You can also run it manually if you want to refresh the data at any time.

> In production, the prebuild script is part of the CI process that is used by GitHub Actions, ensuring each build fetches the most recent data from the backend data server.

## **Refreshing data**

When running the app in `development`, you can use the `refresh data` action buttons to quickly refresh the data without having to rerun the app. This allows you to quickly test changes to the JSON files.
