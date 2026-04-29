# Map settings

In the `map settings`, you can configure the apearance of your map. You can control various settings, such as map projection, map borders and colors.

You can open the map settings panel from the `map toolbar` or by pressing the <kbd>S</kbd> key.

## **Projection**

**`Projection`** controls how the globe surface is represented on a two-dimensional plane. In Atlaset, there are three supported projections: `Natural Earth`, `Equal Earth` and `Mercator`. While Mercator is still the most commonly used projection in maps, it distorts regions further from the equator. Therefore, Natural Earth was chosen as the default option, as it provides a more accurate and pleasant display.

## **Colors**

With the `colors` section, you can control how countries are visually distinguished on the map:

### **Display options**

**`Show home country`** will visually color the user's `home country`. You can set it in the `user settings`.

**`Show visited countries`** will color the user's `visited countries`.

**`Show upcoming new visits`** will highlight any `upcoming new visits`, complimenting the visited countries layer. It is based on the user's trip data, counting upcoming trips to unvisited countries.

By default, `Show visited countries` is enabled, while the other two are disabled. You can enable or disable them by checking or unchecking their respective boxes.

### **Color palettes**

**`Color palettes`** are themed color sets that affect how countries are colored on the map. Each palette is comprised of five different shades, with each value assigned to a specific criteria value when computing the colors.

For reference, the values go from 0 to 4, from left to right.

Color palettes are grouped into various categories:
- **Classic:** Representing popular color palettes
- **Pastel:** Representing soft, bright colors
- **Times of Day:** Representing the different times of the day
- **Seasons:** Representing the seasons of the year
- **Nature:** Representing natural biomes and features

#### **Standard**

The `standard` palette affects the appearance of the main map:

| Country State       | Palette Index | Description                                         |
| ------------------- | ------------- | --------------------------------------------------- |
| Home country        | —             | Uses a fixed color, not from the palette            |
| Hovered country     | 0             | Shown when hovering over a country                  |
| Visited country     | 1             | Controls the color of the `visited countries` layer |
| Selected country    | 2             | Shown when selecting a country                      |
| Upcoming new visit  | 3             | Controls the color of `upcoming new visits`         |
| Highlighted country | 4             | Shown when highlighting a country                   |

#### **Timeline Mode**

When `Timeline Mode` is active, `countries` are colored according to the selected `palette` and the `timeline`’s selected mode:

- In `Cumulative mode`, `countries` are colored by their `visit count`, ordered from highest to lowest.
- In `Yearly mode`, the color will depend on the `visit status` for the year:

| Status             | Palette Index | Description                                    |
| ------------------ | ------------- | ---------------------------------------------- |
| Home country       | —             | Uses a fixed color, not from the palette       |
| First visit        | 0             | First visit to a country this year             |
| Revisit            | 1             | Revisited an already visited country this year |
| Previously visited | 2             | Country has been visited in the past           |
| Upcoming visit     | 3             | An upcoming first visit                        |
| Upcoming revisit   | 4             | An upcoming revisit                            |
