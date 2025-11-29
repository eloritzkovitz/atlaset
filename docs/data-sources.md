# Data Sources

All main data sources are loaded from JSON files in the [public/data](../public/data/) folder.
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