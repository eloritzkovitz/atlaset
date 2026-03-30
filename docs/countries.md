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

### **Search Qualifiers**

In addition to finding countries by name, you can search by qualifiers using this syntax in the country search bar:

```bash
qualifier:query modifier:query
```

All qualifiers are also eligible as modifiers, allowing for more complex filtering.

#### **Supported qualifiers**

| Qualifier     | Type             |                    Example | Notes                                                                                                      |
| ------------- | ---------------- | -------------------------: | ---------------------------------------------------------------------------------------------------------- |
| `isocode`     | string           |               `isocode:gb` | Matches ISO 3166-1 code (partial or exact)                                                                 |
| `region`      | string           |              `region:asia` | Matches countries in a given region (continent)                                                            |
| `subregion`   | string           | `subregion:southeast asia` | Matches countries in a given subregion                                                                     |
| `tc`          | boolean / string |                  `tc:true` | Matches transcontinental countries. Values: `true` / `false`, `contiguous`, `overseas`, `other`            |
| `capital`     | string           |            `capital:paris` | Matches capital name                                                                                       |
| `currency`    | string           |             `currency:eur` | Matches ISO 4217 code                                                                                      |
| `language`    | string           |         `language:spanish` | Matches language                                                                                           |
| `callingcode` | string           |          `callingcode:+44` | Matches calling code                                                                                       |
| `sovereignty` | string           |    `sovereignty:sovereign` | Matches sovereignty type. Values: `sovereign`, `dependency`, `overseas region`, `disputed`, `unrecognized` |
| `sovereign`   | boolean          |           `sovereign:true` | Matches sovereign countries. Values: `true` / `false`                                                      |
| `visited`     | boolean          |             `visited:true` | Matches visited countries. Values: `true` / `false`                                                        |

#### **Additional Modifiers**

| Modifier | Type                |                        Example | Notes                                                                                           |
| -------- | ------------------- | -----------------------------: | ----------------------------------------------------------------------------------------------- |
| `tc`     | string              |  `region:europe tc:other:only` | For `region` and `subregion`, same as qualifier. Additional modes: `default`, `include`, `only` |
| `of`     | string              | `sovereignty:dependency of:gb` | For `sovereignty:dependency` or `sovereignty:overseas region`, filters by sovereign `isocode`   |
| `count`  | number (comparison) |        `visited:true count:>1` | For `visited:true`, filters by visit count. Supports `>`, `<`, `>=`, `<=`, `=`                  |
| `year`   | number (comparison) |       `visited:true year:2020` | For `visited:true`, filters by visit year. Supports `>`, `<`, `>=`, `<=`, `=`                   |
| `first`  | number (comparison) |     `visited:true first:=2012` | For `visited:true`, filters by first visit. Supports `>`, `<`, `>=`, `<=`, `=`                  |
| `last`   | number (comparison) |      `visited:true last:=2018` | For `visited:true`, filters by last visit. Supports `>`, `<`, `>=`, `<=`, `=`                   |

## **Country Lists**

You can create and manage your own custom `lists`, which allow quick, dynamic filtering and toggling. Use lists to group countries for travel plans, tracking or any custom criteria.

- To add a new list, press the `+` button in the list toggles bar.
- Lists can also be created from `layers`, as explained below.
- To edit an existing list, double-click on its toggle.

### **Creating Lists from Layers**

`Layers` are advanced, visual representations of country lists on the map. When creating lists from layers, the `name` and `countries` fields will be shared between both objects. Updating a linked list will also update the relevant content in the layer, allowing for easier management.

## **Learn More**

[Layers](/docs/layers-markers.md)
