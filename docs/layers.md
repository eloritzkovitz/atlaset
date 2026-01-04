# Layers

In Atlaset, **layers** let you add custom map layers, highlighting or visualizing certain data, to your map. Layers are easily configurable, either through the app or from JSON files.   
**Countries** are stored in layers by their **ISO 3166-1 code**, the values of which you can find [here](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes).  
**Layer colors** use the **RGBA** color format. You can find the correct value by using [this tool](https://rgbacolorpicker.com/).

#### Layer JSON Fields

| Field           | Type      | Description                                       |
|-----------------|-----------|---------------------------------------------------|
| `id`            | string    | Unique identifier for the layers (*optional*, generated if missing) |
| `name`          | string    | Display name for the layers                      |
| `color`         | string    | RGBA color for the layers                        |
| `filterLabels`  | map       | Customized filter labels (*optional*, replacing labels for "All"/"Include Only"/"Exclude")       |
| `visible`       | boolean   | Whether the layers is visible by default         |
| `countries`     | string[]  | Array of ISO 3166-1 country codes                 |

## Adding Layers

### 1. From JSON Files

- You can import layers from JSON files. You can see a minimal example (the `id` field is optional and will be generated if omitted) here:

```json
{
  "name": "Example",
  "color": "rgba(255, 255, 255, 1)",
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

### 2. Via the UI

- Use the Layers panel in the app to create, edit, or delete layers.
- Fill the countries array with ISO 3166-1 codes for the relevant countries.
- You can also change the layer's color by changing the RGBA value.

## Importing/Exporting Layers

- Layers can be easily imported from and exported to JSON files.
- Use this to back up your layers or share them with others.

## Visited Countries Layer

Atlaset automatically creates and manages a special layer for visited countries based on your trip data. 

- Changes to your trips will be synchronized with this layer accordingly. 
- This layer **cannot be edited or deleted**, but can be hidden by toggling its visibility off, as well as reordered.

## Timeline Layers & Layer Palettes

Both the Visited Countries layer and Timeline Mode layers use color palettes defined in your settings to visually distinguish countries on the map.

- **Layer Palettes:**  
You can customize color palettes for layerss in the app’s settings. These palettes determine how countries are colored in layerss, including the visited countries layers and timeline layerss.

- **Standard:**  
The visited countries layers and the map use the standard palette to color countries. Visited countries will use the second color in the palette.

- **Timeline Mode:**  
When Timeline Mode is active, countries are colored according to the selected palette and the timeline’s current year or cumulative mode.

  - In **Cumulative mode**, countries are colored based on all visits up to the selected year.
  - In **Yearly mode**, the color will depend on the visit status for the year.

**Tip:**  
To change how layerss and timeline colors appear, go to **Settings → Layer Palettes** and select or customize your preferred palette for each mode.
