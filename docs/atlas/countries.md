# Countries

Atlaset provides an interactive world map to discover `countries`, view detailed country information and track your `visits`. Use `search`, `filters`, `lists` and `layers` to find, organize and manage your countries and travel data.

## **Browsing countries**

- Use the `map` or `country list` to browse all available `countries`.
- Click on a `country` on the `map` or the `country list` to open a detailed view with information.
- Use the `search bar` to quickly find a `country` by name. For advanced searching, see below.

## **Country details**

Country details include the following sections:

- **`Overview`**: Including `name` and `flag`, `sovereignty status`, `region`, `subregion`, `capital`, `currency`, `languages` and more.
- **`Relations`**: If any, including `dependencies`, `internal regions` and `disputes`.
- **`Visits`**: See below.

## **Your visits**

- The badge to the right of the country's name indicates whether the country is visited or not (with a special case being the `home country`).
- By clicking the `Visits` tab, you can open a detailed view of your `visit history` to the specific country.
- Data is based on your `trip data`.

## **Filtering & sorting**

- Use the `Filters` panel to:
  - Filter by `region`, `subregion`, `sovereignty`, `visit status` or custom criteria
  - Apply `layer` or `timeline` filters (depending on active `map mode`)
- Use the `Sort` button to:
  - Sort `countries` by `name`, `ISO 3166-1 code`, `area` or `population` and by sort direction (`ascending` or `descending`)
  - In `timeline` mode, you can also sort by `visit count`, `first visit time` or `last visit time`
- Use the `View toggle` to switch between `lists`:
  - Default lists include `all` (showing all countries and territories), `sovereign` (showing sovereign countries only) and `visited`

### **Search qualifiers**

In addition to finding countries by name, you can search by qualifiers using this syntax in the country search bar:

```bash
qualifier:query modifier:query
```

#### **Supported qualifiers**

| Qualifier         | Type                |                            Example | Notes                                                                                                        |
| ----------------- | ------------------- | ---------------------------------: | ------------------------------------------------------------------------------------------------------------ |
| `isocode`         | string              |                       `isocode:gb` | Matches ISO 3166-1 alpha-2 code                                                                              |
| `iso3code`        | string              |                     `iso3code:gbr` | Matches ISO 3166-1 alpha-3 code                                                                              |
| `region`          | string              |                      `region:asia` | Matches countries in a given region (continent)                                                              |
| `subregion`       | string              |         `subregion:southeast asia` | Matches countries in a given subregion                                                                       |
| `tc`              | boolean / string    |                          `tc:true` | Matches transcontinental countries. Values: `true` / `false`, `contiguous`, `overseas`, `cultural`, `other`  |
| `geotype`         | string              |                   `geotype:island` | Matches geographic types. Values: `coastal`, `landlocked`, `island`                                          |
| `capital`         | string              |                    `capital:paris` | Matches capital name                                                                                         |
| `language`        | string              |                 `language:spanish` | Matches language                                                                                             |
| `government`      | string              | `government:presidential republic` | Matches government type                                                                                      |
| `area`            | number (comparison) |                       `area:~2000` | Matches area (in km²). Supports plain or comma-separated numbers                                             |
| `population`      | number (comparison) |           `population:>=1,000,000` | Matches population. Supports plain or comma-separated numbers                                                |
| `currency`        | string              |                     `currency:eur` | Matches ISO 4217 code                                                                                        |
| `timezone` / `tz` | string              |                  `timezone:utc+03` | Matches countries by UTC offset. Accepts `UTC±HH`, `UTC±HH:MM`, `±HH:MM` or `±HHMM`                          |
| `callingcode`     | string              |                  `callingcode:+44` | Matches calling code                                                                                         |
| `drivingside`     | string              |                 `drivingside:left` | Matches driving side. Values: `left`, `right`                                                                |
| `sovereignty`     | string              |            `sovereignty:sovereign` | Matches sovereignty status. Values: `sovereign`, `dependency`, `overseas region`, `disputed`, `unrecognized` |
| `sovereign`       | string              |                   `sovereign:true` | Matches sovereign status or governing sovereign state. Values: `true` / `false`, `<isocode>`                 |
| `unmember`        | boolean             |                    `unmember:true` | Matches UN membership. Values: `true` / `false`                                                              |
| `memberof`        | string              |                      `memberof:eu` | Matches membership in international organizations                                                            |
| `visited`         | boolean             |                     `visited:true` | Matches visited countries. Values: `true` / `false`                                                          |

#### **Additional modifiers**

| Modifier | Type                |                        Example | Notes                                                                                                                                           |
| -------- | ------------------- | -----------------------------: | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `match`  | string              | `language:english match:exact` | Supports `prefix` (default), `substring`, `exact`, `regex`                                                                                      |
| `tc`     | string              |  `region:europe tc:other:only` | Supports additional modes: `default`, `include`, `only`                                                                                         |
| `dst`    | boolean             |      `timezone:+0200 dst:true` | For `timezone`, matches countries based on daylight saving time offsets. Zones without DST will filter by winter time. Values: `true` / `false` |
| `count`  | number (comparison) |        `visited:true count:>1` | For `visited:true`, filters by visit count                                                                                                      |
| `year`   | number (comparison) |       `visited:true year:2020` | For `visited:true`, filters by visit year                                                                                                       |
| `first`  | number (comparison) |     `visited:true first:=2012` | For `visited:true`, filters by year of first visit                                                                                              |
| `last`   | number (comparison) |      `visited:true last:=2018` | For `visited:true`, filters by year of last visit                                                                                               |

> #### **Notes:**
>
> - All qualifiers are also eligible as modifiers, allowing for more complex and precise filtering.
> - For number comparisons, the following operators are supported: `>`, `<`, `>=`, `<=`, `~`, `=`

## **Country lists**

You can create and manage your own custom `lists`, which allow quick, dynamic filtering and toggling. Use lists to group countries for travel plans, tracking or any custom criteria.

- To add a new list, press the `+` button in the list toggles bar.
- Lists can also be created from `layers`, as explained below.
- To edit an existing list, double-click on its toggle.

### **Creating lists from layers**

`Layers` are advanced, visual representations of country lists on the map. When creating lists from layers, the `name` and `countries` fields will be shared between both objects. Updating a linked list will also update the relevant content in the layer, allowing for easier management.

## **Learn more**

[Layers](/docs/layers-markers.md)
