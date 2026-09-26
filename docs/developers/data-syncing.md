# Data sync & updates

Atlaset provides a prebuild script that automatically fetches and updates static data files, including flags, countries, country facts, currencies, geodata, achievements and documentation.

```bash
npm run prebuild
```

This script runs all fetch scripts in `scripts/data/` to ensure your static assets are always up to date. You can also run it manually if you want to refresh the data at any time.

> <icon name="info"></icon> **Note**
>
> In production, the prebuild script is part of the CI process that is used by GitHub Actions, ensuring each build fetches the most recent data from the backend data server.

## Refreshing data

When running the app in **Development mode**, you can use the <icon name="refresh"></icon> **Refresh data** action buttons to quickly refresh the data without having to rerun the app. This allows you to quickly test changes to the JSON files.
