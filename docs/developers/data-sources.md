# Data Sources

## **Static Data (JSON)**

All main `data sources` are loaded from static `JSON` files, either directly from the [`public/data`](../public/data/) folder (in development) or from a remote `URL` (in production, if configured).

You can change their location or swap datasets by editing the `.env` file.

### **Data Types and Variables**

| Data Type      | Default Path              | Environment Variable         |
| -------------- | ------------------------- | ---------------------------- |
| `Map GeoJSON`  | `/data/countries.geojson` | `VITE_MAP_GEO_URL`           |
| `Countries`    | `/data/countries.json`    | `VITE_COUNTRY_DATA_URL`      |
| `Currencies`   | `/data/currencies.json`   | `VITE_CURRENCY_DATA_URL`     |
| `Achievements` | `/data/achievements.json` | `VITE_ACHIEVEMENTS_DATA_URL` |

### **Sources**

- `Country boundaries`: [datasets/geo-countries](https://github.com/datasets/geo-countries)
- `Country data`: [REST Countries](https://restcountries.com/)
- `Currency data`: [Open Exchange Rates](https://openexchangerates.org/api/currencies.json)

## **Flag Data**

`Country flags` are loaded either from `SVG files` or from `React components`. Atlases uses flags in two separate forms:

- **Original proportions flags**, used in country details, are loaded from SVG files in the `public/flags` folder.
- **3x2 flags**, displayed in lists, loaded as React components from a private npm package based on the flags from [country-flag-icons](https://www.npmjs.com/package/country-flag-icons), along with additional flags.

Flags are named by their country's ISO 3166 Alpha-2 code.

For the original proportions flags (in `public/flags`), you can simply get the SVGs from Wikipedia or any other source.

### **Creating your own package**

For 3x2 flags, you can create your own package by using the provided scripts:

- [generate-flag-components.ts](/scripts/assets/generate-flag-components.ts) (creates React components from SVGs)
- [clean-attributes.js](/scripts/assets/clean-attributes.js) (needed to make some components usable)

You will need an `index.json` file listing the ISO 3166 codes for the flags you want to make components from. For example:

```json
["AA", "BB", "CC"]
```

Another alternative is using the package mentioned above, which will require a minor import change in the `CountryFlag` component.

## **Adding Country Fields**

Atlaset uses a few additional fields in addition to the ones provided in the basic dataset. The `scripts` folder provides various built-in scripts for automated addition of new fields to your countries.json file. You can find more detailed information in [this section](/docs/developers/adding-country-fields.md).

## **Learn More**

[Countries](/docs/countries.md)
[Adding country fields](/docs/developers/adding-country-fields.md)
[Data sync & updates](/docs/developers/data-syncing.md)
