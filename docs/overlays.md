# Overlays

In Atlaset, **overlays** let you add custom map layers, highlighting or visualizing certain data, to your map. Overlays are easily configurable, either through the app or from JSON files.   
**Countries** are stored in overlays by their **ISO 3166-1 code**, the values of which you can find [here](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes).  
**Overlay colors** use the **RGBA** color format. You can find the correct value by using [this tool](https://rgbacolorpicker.com/).

#### Overlay JSON Fields

| Field      | Type      | Description                                       |
|------------|-----------|---------------------------------------------------|
| `id`       | string    | Unique identifier for the overlay (*optional*, generated if missing) |
| `name`     | string    | Display name for the overlay                      |
| `color`    | string    | RGBA color for the overlay                        |
| `tooltip`  | string    | Tooltip text shown on hover                       |
| `visible`  | boolean   | Whether the overlay is visible by default         |
| `countries`| string[]  | Array of ISO 3166-1 country codes                 |

## Adding Overlays

### 1. From JSON Files

- You can import overlays from JSON files. You can see a minimal example (the `id` field is optional and will be generated if omitted) here:

```json
{
  "name": "Example",
  "color": "rgba(255, 255, 255, 1)",
  "tooltip": "Example",
  "visible": true,
  "countries": ["IL", "US", "FR"]
}
```

[Download a full example overlay JSON](../examples/overlay.json)

- To import, use the Overlays panel in the app and select your JSON file.

### 2. Via the UI

- Use the Overlays panel in the app to create, edit, or delete overlays.
- Fill the countries array with ISO 3166-1 codes for the relevant countries.
- You can also change the layer's color by changing the RGBA value.

## Importing/Exporting Overlays

- Overlays can be easily imported from and exported to JSON files.
- Use this to back up your overlays or share them with others.

## Visited Countries Overlay

Atlaset automatically creates and manages a special overlay for visited countries based on your trip data. 

- Changes to your trips will be synchronized with this overlay accordingly. 
- This overlay **cannot be edited or deleted**, but can be hidden by toggling its visibility off, as well as reordered.

## Timeline Overlays & Overlay Palettes

Both the Visited Countries overlay and Timeline Mode overlays use color palettes defined in your settings to visually distinguish countries on the map.

- **Overlay Palettes:**  
You can customize color palettes for overlays in the app’s settings. These palettes determine how countries are colored in overlays, including the visited countries overlay and timeline overlays.

- **Standard:**  
The visited countries overlay and the map use the standard palette to color countries. Visited countries will use the second color in the palette.

- **Timeline Mode:**  
When Timeline Mode is active, countries are colored according to the selected palette and the timeline’s current year or cumulative mode.

  - In **Cumulative mode**, countries are colored based on all visits up to the selected year.
  - In **Yearly mode**, the color will depend on the visit status for the year.

**Tip:**  
To change how overlays and timeline colors appear, go to **Settings → Overlay Palettes** and select or customize your preferred palette for each mode.
