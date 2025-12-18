# Data Sources

All main data sources are loaded from JSON files, either directly from files or through API (from a URL).  
Locally, they will be fetched from the [public/data](../public/data/) folder by default.
You can change their location or swap datasets by editing the `.env` file.

## Data Types and Vriables

| Data Type   | Default Path              | Environment Variable     |
| ----------- | ------------------------- | ------------------------ |
| Map GeoJSON | `/data/countries.geojson` | `VITE_MAP_GEO_URL`       |
| Countries   | `/data/countries.json`    | `VITE_COUNTRY_DATA_URL`  |
| Currencies  | `/data/currencies.json`   | `VITE_CURRENCY_DATA_URL` |

## Sources

- Country boundaries: [datasets/geo-countries](https://github.com/datasets/geo-countries)
- Country data: [REST Countries](https://restcountries.com/)
- Currency data: [Open Exchange Rates](https://openexchangerates.org/api/currencies.json)

## Adding Sovereignty Type to Country Data

- To automatically add or update the `sovereigntyType` property for each country in your `countries.json`, use the provided [script](../scripts/add-sovereignty-type.js):

```bash
node add-sovereignty-type.js [path/to/countries.json] [path/to/customSovereigntyMap.json]
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

You can find an example showing a few counntry objects [here](../examples/coountries.json).

## Data Caching and Local Database

### Caching Strategy

- **Data sources** are cached locally in the browser using [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) via [Dexie.js](https://dexie.org/).
- This allows for fast loading, offline access, and reduces backend/API calls.
- Cached data is stored in the user's browser using IndexedDB (via Dexie), with a **Time-To-Live (TTL)** of 1 week by default. After this period, the app will automatically refresh the data from the server.

### How to clear or refresh the cache

- The cache is automatically refreshed after the TTL expires.
- You can also manually refresh country data by using the refresh button in the countries panel.
- To clear all cached data,you can clear your browser's site data or use developer tools to clear IndexedDB.
