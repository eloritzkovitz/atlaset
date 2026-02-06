# Layers & Markers

Atlaset lets you customize your map with `layers` (highlighting groups of `countries`) and `markers` (custom points with details). Both can be managed, exported, imported and shared easily either through the app or from `JSON` files.

## **Layers**

`Countries` are stored in `layers` by their `ISO 3166-1 code`, the values of which you can find [here](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes).

**Layer colors** use `RGBA` or `8-digit hex` color formats to support optional alpha transparency. You can find the correct value by using [this tool](https://rgbacolorpicker.com/).

#### Layer JSON Fields

| Field          | Type       | Description                                                                                |
| -------------- | ---------- | ------------------------------------------------------------------------------------------ |
| `id`           | `string`   | Unique identifier for the layers (_optional_, generated if missing)                        |
| `name`         | `string`   | Display name for the layers                                                                |
| `color`        | `string`   | RGBA or hex color for the layers (RGBA will be converted to hex on import)                 |
| `filterLabels` | `map`      | Customized filter labels (_optional_, replacing labels for `All`/`Include Only`/`Exclude`) |
| `visible`      | `boolean`  | Whether the layers is visible by default                                                   |
| `countries`    | `string[]` | Array of ISO 3166-1 country codes                                                          |

### **Adding Layers**

#### 1. From JSON Files

- You can import `layers` from `JSON` files. You can see a minimal example (the `id` field is optional and will be generated if omitted) here:

```json
{
  "name": "Example",
  "color": "#ffffffff", //8-digit hex, ("rgba(255, 255, 255, 1)" if using RGBA)
  "filterLabels": {
    "all": "All",
    "only": "Include Only",
    "exclude": "Exclude"
  },
  "visible": true,
  "countries": ["IL", "US", "FR"]
}
```

[Download a full example layers JSON](/docs/examples/layers.json)

- To import, use the `Layers` panel in the app and select your `JSON` file.

#### 2. Via the UI

- Use the `Layers` panel in the app to create, edit, or delete `layers`.
- Fill the `countries` array with `ISO 3166-1 codes` for the relevant countries.
- You can also change the layer's color by changing the `RGBA` value.

### **Visited Countries Layer**

Atlaset automatically creates and manages a special `layer` for `visited countries` based on your `trip data`.

- Changes to your `trips` will be synchronized with this layer accordingly.
- This layer **cannot be edited or deleted**, but can be hidden by toggling its visibility off, as well as reordered.

> **Tip:**
> To change the color of the `visited countries` layer, in the map toolbar's `Settings`, look for `Color Palettes` and select or customize your preferred palette. The layer will use the second value in the palette.

## **Markers**

`Markers` are custom points you can add to your map. `Markers` are placed on the map by clicking on a location.
Each `marker` can have:

- `name (optional)`: Display name
- `coordinates`: `[longitude, latitude]` (as numbers)
- `color (optional)`: Marker color (`hex`)
- `description (optional)`: Additional information

## **Importing/Exporting Map Data**

- `Layers` can be easily imported from and exported to `JSON` files.
- Use this to back up your `layers` or share them with others.
- You can also download the entire `map data` through the `Export` panel, `"Download as JSON"`.
