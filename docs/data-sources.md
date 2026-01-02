# Data Sources

All main data sources are loaded from static JSON files, either directly from the [public/data](../public/data/) folder (in development) or from a remote URL (in production, if configured).  
You can change their location or swap datasets by editing the `.env` file.

## Data Types and Variables

| Data Type   | Default Path              | Environment Variable     |
| ----------- | ------------------------- | ------------------------ |
| Map GeoJSON | `/data/countries.geojson` | `VITE_MAP_GEO_URL`       |
| Countries   | `/data/countries.json`    | `VITE_COUNTRY_DATA_URL`  |
| Currencies  | `/data/currencies.json`   | `VITE_CURRENCY_DATA_URL` |

## Sources

- Country boundaries: [datasets/geo-countries](https://github.com/datasets/geo-countries)
- Country data: [REST Countries](https://restcountries.com/)
- Currency data: [Open Exchange Rates](https://openexchangerates.org/api/currencies.json)

## Keeping Data Up to Date

To automatically fetch and update all static data files (flags, countries, currencies, and geojson), a prebuild script is provided and run before every build:

```bash
npm run prebuild
```

This script runs all fetch scripts in `scripts/data/` to ensure your static assets are always up to date. You can also run it manually if you want to refresh the data at any time.

If you need to add or update the `sovereigntyType` property for each country in your `countries.json`, use the provided [script](../scripts/add-sovereignty-type.js):

```bash
node scripts/add-sovereignty-type.js [path/to/countries.json] [path/to/customSovereigntyMap.json]
```

Your JSON mapping should look like this:

```json
{
  "sovereign": ["FR", "GB", ...],
  "dependency": ["GI", ...],
  "overseas region": ["GF"],
  "disputed": ["EH", ...]
}
```

You can find an example showing a few country objects [here](../examples/countries.json).
