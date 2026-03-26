# Countries

Atlaset provides an interactive world map to discover `countries`, view detailed country information and track your `visits`. Use `search`, `filters`, `lists` and `layers` to find, organize and manage your countries and travel data.

## **Browsing Countries**

- Use the `map` or `country list` to browse all available `countries`.
- Click on a `country` on the `map` or the `country list` to open a detailed view with information.
- Use the `search bar` to quickly find a `country` by name. For advanced searching, see below.

## **Country Details**

Country details include the following sections:

- **`Overview`**: Including `name` and `flag`, `sovereignty status`, `region`, `subregion`, `capital`, `currency`, `languages` and more.
- **`Relations`**: If any, including `dependencies`, `internal regions` and `disputes`.
- **`Visits`**: See below.

## **Your Visits**

- The badge to the right of the country's name indicates whether the country is visited or not (with a special case being the `home country`).
- By clicking the `Visits` tab, you can open a detailed view of your `visit history` to the specific country.
- Data is based on your `trip data`.

## **Filtering & Sorting**

- Use the `Filters` panel to:
  - Filter by `region`, `subregion`, `sovereignty`, `visit status` or custom criteria
  - Apply `layer` or `timeline` filters (depending on active `map mode`)
- Use the `Sort` button to:
  - Sort `countries` by `name` or `ISO 3166-1 code` and by sort direction (`ascending` or `descending`)
  - In `timeline` mode, you can also sort by `visit count`, `first visit time` or `last visit time`
- Use the `View toggle` to switch between `lists`:
  - Default lists include `all` (showing all countries and territories), `sovereign` (showing sovereign countries only) and `visited`

### **Property Searching**

In addition to finding countries by name, you can search by properties using this syntax in the country search bar:

```bash
property:query
```

#### **Supported properties**

| Property       | Type                |                    Example | Notes                                                                                             |
| -------------- | ------------------- | -------------------------: | ------------------------------------------------------------------------------------------------- |
| `isocode`      | text                |               `isocode:GB` | ISO 3166-1 code (partial or exact)                                                                |
| `region`       | text                |              `region:Asia` | Use `region_tc` to include transcontinental overrides                                             |
| `region_tc`    | text                |         `region_tc:Europe` | Region including transcontinental matches                                                         |
| `subregion`    | text                | `subregion:Southeast Asia` | Use `subregion_tc` to include transcontinental overrides                                          |
| `subregion_tc` | text                |   `subregion_tc:Caribbean` | Subregion including transcontinental matches                                                      |
| `capital`      | text                |            `capital:Paris` | Matches capital name                                                                              |
| `currency`     | text                |             `currency:EUR` | Matches currency code                                                                             |
| `language`     | text                |         `language:Spanish` | Matches a language                                                                                |
| `callingcode`  | text                |          `callingcode:+44` | Matches a calling code                                                                            |
| `sovereignty`  | text                |    `sovereignty:Sovereign` | Values: `sovereign`, `dependency`, `overseas region`, `disputed`, `unrecognized`                  |
| `sovereign`    | boolean             |           `sovereign:true` | `true` / `false`                                                                                  |
| `visited`      | boolean             |             `visited:true` | `true` / `false` (based on your visited list)                                                     |
| `visits`       | number (comparison) |                `visits:>1` | Supports `>`, `<`, `>=`, `<=`, `=`; `=0` / `<1` (show all countries), `>0` (matches visited only) |
| `visityear`    | number (comparison) |         `visityear:<=2025` | Supports `>`, `<`, `>=`, `<=`, `=`                                                                |
| `firstvisit`   | number (comparison) |         `firstvisit:=2012` | Supports `>`, `<`, `>=`, `<=`, `=`                                                                |
| `lastvisit`    | number (comparison) |          `lastvisit:=2018` | Supports `>`, `<`, `>=`, `<=`, `=`                                                                |

## **Country Lists**

You can create and manage your own custom `lists`, which allow quick, dynamic filtering and toggling. Use lists to group countries for travel plans, tracking or any custom criteria.

- To add a new list, press the `+` button in the list toggles bar.
- Lists can also be created from `layers`, as explained below.
- To edit an existing list, double-click on its toggle.

### **Creating Lists from Layers**

`Layers` are advanced, visual representations of country lists on the map. When creating lists from layers, the `name` and `countries` fields will be shared between both objects. Updating a linked list will also update the relevant content in the layer, allowing for easier management.

## **Learn More**

[Layers](/docs/layers-markers.md)
