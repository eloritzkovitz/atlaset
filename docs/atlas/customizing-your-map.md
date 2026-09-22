# Customizing your map

In the **Map Settings** panel, you can configure the appearance of your map. You can control various settings, such as map projection, map borders, colors and other visual elements.

You can open the **Map Settings** panel from the map toolbar or by pressing the <kbd>S</kbd> key.

## Configuration

The **Configuration** section allows you to control the basic style of the map, such as base color, borders and projection.

### Projection

**Projection** controls how the globe surface is represented on a two-dimensional plane. In Atlaset, there are three supported projections: [**Natural Earth**](https://en.wikipedia.org/wiki/Natural_Earth_projection), [**Equal Earth**](https://en.wikipedia.org/wiki/Equal_Earth_projection) and [**Mercator**](https://en.wikipedia.org/wiki/Mercator_projection).

**Mercator** preserves angles and is commonly used for navigation, but it introduces increasing distortion toward the poles. **Natural Earth** is the default projection because it provides a balanced representation of the world's landmasses.

## Interface

The **Interface** section allows you to modify the user interface.

- **Toolbar orientation** allows you to toggle between **vertical** and **horizontal** layouts of the map toolbar.

## Overlays

The **Overlays** section allows you to toggle various visual overlays on the map.

- **Show small country overlays** will show circles on top of small countries (with a land area smaller than 10,000 km²).
- **Include integral regions** will make highlighting sovereign countries with overseas regions highlight them as well.

### Tracking layers

- **Show home country** will visually color the user's home country. You can set it in the **User Settings**.
- **Show visited countries** will color the user's visited countries.
- **Show upcoming new visits** will highlight any upcoming new visits, complimenting the visited countries layer. It is based on the user's trip data, counting upcoming trips to unvisited countries.
- **Show 'Want to Visit'** will color the user's 'Want to Visit' countries.

By default, all the tracking layer options are disabled. You can enable or disable them by checking or unchecking their respective boxes.

## Colors

The `Colors` section controls how countries are visually distinguished on the map.

### Rules & modifiers

- **Number of atlas colors:** In **Atlas mode**, determines whether countries will be colored based on the **four color theorem** (default) or **five color theorem**.

### Color palettes

`Color palettes` are themed color sets that affect how countries are colored on the map. Each palette is comprised of five different shades, with each value assigned to a specific criteria value when computing the colors.

For reference, the values go from 0 to 4, from left to right.

Color palettes are grouped into various categories:

- **Classic:** Representing popular color palettes
- **Pastel:** Representing soft, bright colors
- **Times of Day:** Representing the different times of the day
- **Seasons:** Representing the seasons of the year
- **Nature:** Representing natural biomes and features

#### Standard

The `Standard` palette affects the appearance of the main map:

| Country State       | Palette Index | Description                                       |
| ------------------- | ------------- | ------------------------------------------------- |
| Home country        | —             | Uses a fixed color, not from the palette          |
| Hovered country     | 0             | Shown when hovering over a country                |
| Visited country     | 1             | Controls the color of the visited countries layer |
| Selected country    | 2             | Shown when selecting a country                    |
| Upcoming new visit  | 3             | Controls the color of upcoming new visits         |
| Highlighted country | 4             | Shown when highlighting a country                 |

#### Atlas

The **Atlas** palette affects the appearance of the atlas map when in **Atlas Mode**. Coloring is based on the [**four color theorem**](https://en.wikipedia.org/wiki/Four_color_theorem), where no more than four colors are required to color all countries on the map while no country will have an adjacent country of the same color. The coloring logic also takes proximity into account (for cases such as island neighbors).

#### Timeline mode

When **Timeline mode** is active, countries are colored according to the selected palette and mode:

- In **Cumulative mode**, countries are colored by their visit count, ordered from highest to lowest.
- In **Yearly mode**, the color will depend on the visit status for the year:

| Status             | Palette Index | Description                                    |
| ------------------ | ------------- | ---------------------------------------------- |
| Home country       | —             | Uses a fixed color, not from the palette       |
| First visit        | 0             | First visit to a country this year             |
| Revisit            | 1             | Revisited an already visited country this year |
| Previously visited | 2             | Country has been visited in the past           |
| Upcoming visit     | 3             | An upcoming first visit                        |
| Upcoming revisit   | 4             | An upcoming revisit                            |
