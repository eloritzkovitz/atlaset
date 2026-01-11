# Map Data & Customization

Atlaset lets you customize your map with **layers** (highlighting groups of countries) and **markers** (custom points with details). Both can be managed, exported, imported and shared easily either through the app or from JSON files.

## Layers
 
**Countries** are stored in layers by their **ISO 3166-1 code**, the values of which you can find [here](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes).  
**Layer colors** use **RGBA** or **8-digit hex** color formats to support optional alpha transparency. You can find the correct value by using [this tool](https://rgbacolorpicker.com/).

#### Layer JSON Fields

| Field           | Type      | Description                                       |
|-----------------|-----------|---------------------------------------------------|
| `id`            | string    | Unique identifier for the layers (*optional*, generated if missing) |
| `name`          | string    | Display name for the layers                      |
| `color`         | string    | RGBA or hex color for the layers (RGBA will be converted to hex on import)                        |
| `filterLabels`  | map       | Customized filter labels (*optional*, replacing labels for "All"/"Include Only"/"Exclude")       |
| `visible`       | boolean   | Whether the layers is visible by default         |
| `countries`     | string[]  | Array of ISO 3166-1 country codes                 |

### Adding Layers

#### 1. From JSON Files

- You can import layers from JSON files. You can see a minimal example (the `id` field is optional and will be generated if omitted) here:

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

[Download a full example layers JSON](../examples/layers.json)

- To import, use the Layers panel in the app and select your JSON file.

#### 2. Via the UI

- Use the Layers panel in the app to create, edit, or delete layers.
- Fill the countries array with ISO 3166-1 codes for the relevant countries.
- You can also change the layer's color by changing the RGBA value.

## Special Layers

### Visited Countries Layer

Atlaset automatically creates and manages a special layer for visited countries based on your trip data. 

- Changes to your trips will be synchronized with this layer accordingly. 
- This layer **cannot be edited or deleted**, but can be hidden by toggling its visibility off, as well as reordered.

---

### Timeline Layers & Layer Palettes

Both the Visited Countries layer and Timeline Mode layers use color palettes defined in your settings to visually distinguish countries on the map.

- **Layer Palettes:**  
You can customize color palettes for layers in the app’s settings. These palettes determine how countries are colored in layers, including the visited countries layers and timeline layers.

- **Standard:**  
The visited countries layers and the map use the standard palette to color countries. Visited countries will use the second color in the palette.

- **Timeline Mode:**  
When Timeline Mode is active, countries are colored according to the selected palette and the timeline’s current year or cumulative mode.

  - In **Cumulative mode**, countries are colored based on all visits up to the selected year.
  - In **Yearly mode**, the color will depend on the visit status for the year.

> **Tip:**  
> To change how layers and timeline colors appear, in the map toolbar's **Settings**, look for **Color Palettes** and select or customize your preferred palette for each mode.

## Markers

**Markers** are custom points you can add to your map. Markers are placed on the map by clicking on a location.
Each marker can have:

- `name (optional)`: Display name
- `coordinates`: [longitude, latitude] (as numbers)
- `color (optional)`: Marker color (hex)
- `description (optional)`: Additional information

## Importing/Exporting Map Data

- Layers can be easily imported from and exported to JSON files.
- Use this to back up your layers or share them with others.
- You can also download the entire map data (including markers) through the **Export** panel, "**Download as JSON**".

## Sharing Maps

Atlaset supports sharing your maps (layers and markers) via a special URL:

- Use the **Share** feature to generate a link.
- Selectable options include layers, markers, map name and sharer info.
- Anyone with the link can view the map and its information in readonly mode.
- The map data is encoded in the URL and is independent of the sharer's data.

## Embedding Maps

Atlaset supports embedding maps directly into your website or blog using an HTML `<iframe>`. This allows you to display interactive maps anywhere online.

- Use the **Embed** feature to generate an iframe link.
- Copy the provided HTML `<iframe>` code into and paste it into your website's HTML where you want the map to appear.
- You can see an example [here](../examples/embedded-map.html).
