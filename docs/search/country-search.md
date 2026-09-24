# Country search

The **Countries search bar** supports qualifiers and modifiers for precise searches. Use them to search and filter countries by geographic, political, demographic, visit and other criteria.

## Understanding the query structure

Queries are built from terms you would like to search and qualifiers or modifiers, which narrow down the search.

A regular search term will return results by name only, for example:

```bash
fr
```

The above query will return all countries that begin with "fr", or contain any word that begins with "fr".

By using qualifiers, you can narrow down your search results for more specific results. For example, using the `region` qualifier will return all countries in a specific region (continent). For example:

```bash
region:europe
```

This query will return all the countries in Europe, including dependencies and territories.

You can combine multiple qualifiers and modifiers in a single search, separated by a whitespace. For example, adding the `sovereign` qualifier will narrow down the results to all sovereign countries in Europe. For example:

```bash
region:europe sovereign:true
```

## Using country qualifiers

### Basic qualifiers

Country qualifiers filter countries based on their geographic, demographic, political and other features from the country data. The following table shows the full list of available qualifiers for countries:

| Qualifier     | Type                |                    Example | Notes                                                            |
| ------------- | ------------------- | -------------------------: | ---------------------------------------------------------------- |
| `isocode`     | string              |               `isocode:gb` | Matches ISO 3166-1 alpha-2 code                                  |
| `iso3code`    | string              |             `iso3code:gbr` | Matches ISO 3166-1 alpha-3 code                                  |
| `region`      | string              |              `region:asia` | Matches countries in a given region (continent)                  |
| `subregion`   | string              | `subregion:southeast_asia` | Matches countries in a given subregion                           |
| `capital`     | string              |            `capital:paris` | Matches capital name                                             |
| `language`    | string              |         `language:spanish` | Matches language. Supports both ISO 639 code or name             |
| `area`        | number (comparison) |               `area:~2000` | Matches area (in km²). Supports plain or comma-separated numbers |
| `population`  | number (comparison) |   `population:>=1,000,000` | Matches population. Supports plain or comma-separated numbers    |
| `currency`    | string              |             `currency:eur` | Matches ISO 4217 code                                            |
| `callingcode` | string              |          `callingcode:+44` | Matches calling code                                             |
| `drivingside` | string              |         `drivingside:left` | Matches driving side. Values: `left`, `right`                    |
| `unmember`    | boolean             |            `unmember:true` | Matches UN membership. Values: `true` / `false`                  |
| `memberof`    | string              |              `memberof:eu` | Matches membership in international organizations                |

Additional qualifiers include:

- [Geographic type qualifier](#geographic-type-qualifier)
- [Transcontinental qualifier](#transcontinental-qualifier)
- [Government and structure qualifiers](#government-and-structure-qualifiers)
- [Timezone qualifier](#timezone-qualifier)
- [Sovereign and sovereignty qualifiers](#sovereign-and-sovereignty-qualifiers)
- [Tracking qualifiers](#tracking-qualifiers)

### Geographic type qualifier

The `geotype` qualifier will filter countries by their geographic type. Currently supported values include:

- `coastal`
- `island`
- `landlocked`

For example:

```bash
geotype:landlocked
```

This example will return all landlocked countries.

### Transcontinental qualifier

As the country data assigns countries to a single region and subregion, the `tc` qualifier allows transcontinental countries to be matched against additional regions and subregions beyond their primary region and subregion.

The `tc` qualifier supports two options: a **scope**, which determines which type of transcontinental classification to match, and a **mode**, which determines how those countries are included in the results.

The `tc` qualifier uses the following syntax:

```bash
tc:<scope>

tc:<scope>:<mode>
```

When `mode` is omitted, `only` is used by default.

#### Transcontinental scope

The scope determines which transcontinental classification is matched.

| Scope        | Description                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------------ |
| `all`        | Matches all transcontinental classifications.                                                          |
| `contiguous` | Matches transcontinental countries with geographically connected territory across continents.          |
| `overseas`   | Matches transcontinental countries with overseas territory in another continent.                       |
| `cultural`   | Matches countries classified as transcontinental based on cultural association with another continent. |
| `other`      | Matches transcontinental countries that do not fit the other classifications.                          |

For example:

```bash
tc:contiguous
```

This search matches only transcontinental countries with the `contiguous` classification.

#### Transcontinental mode

The mode determines how countries matching the transcontinental scope are applied to the search results.

| Mode      | Description                                                                                                        |
| --------- | ------------------------------------------------------------------------------------------------------------------ |
| `include` | Includes matching transcontinental countries in addition to countries normally matched by the region or subregion. |
| `exclude` | Excludes matching transcontinental countries from the results.                                                     |
| `only`    | Limits the results to matching transcontinental countries.                                                         |

- By default, `only` is used when `mode` is omitted. For example:

  ```bash
  tc:all
  ```

  This search matches all transcontinental countries, and will be equivalent to:

  ```bash
  tc:all:only
  ```

- The `include` mode can be used with a `region` or `subregion` qualifier to include transcontinental countries that are additionally associated with that region or subregion. For example:

  ```bash
  region:europe tc:all:include
  ```

  This search matches countries normally assigned to Europe, along with transcontinental countries whose additional region is Europe.

- The `exclude` mode can be used to remove matching transcontinental countries. For example:

  ```bash
  region:europe tc:contiguous:exclude
  ```

  This search matches Europe while excluding transcontinental countries with the `contiguous` classification.

### Government and structure qualifiers

The `government` qualifier matches forms of government, as detailed [here](https://en.wikipedia.org/wiki/Government).

The following types are supported:

- `constitutional_monarchy`
- `parliamentary_republic`
- `presidential_republic`
- `semi_presidential_republic`
- `assembly_independent_republic`
- `theocratic_republic`
- `islamic_theocracy`
- `semi_constitutional_monarchy`
- `absolute_monarchy`
- `communist_state`
- `one_party_state`
- `military_junta`
- `provisional_government`
- `dependent_territory`
- `other`

The `structure` qualifier matches state structures. Supported values are `unitary` and `federal`. For example:

```bash
structure:federal
```

This will return all federal countries.

### Timezone qualifier

The `timezone` (or `tz`) qualifier matches countries by UTC offset. The following formats are supported:

- `UTC±HH`
- `UTC±HH:MM`
- `±HH:MM`
- `±HHMM`

By adding the `dst` modifier, you can filter UTC offsets by daylight saving time. For example:

```bash
tz:UTC+02 dst:true
```

In this query, the result will filter countries that use UTC+02 as their daylight saving time, rather than as standard time.

### Sovereign and sovereignty qualifiers

The `sovereign` qualifier can be used to filter by sovereign status or by the governing sovereign state. For example:

```bash
sovereign:true
```

This query will return all sovereign countries.

Alternatively, you can use `sovereign:false` to match all countries that are not sovereign.

You can also use the `sovereign` qualifier to match territories associated with a specified sovereign state. This option will only work for sovereign countries that have dependent territories or overseas regions. For example:

```bash
sovereign:gb
```

This example will return all dependent territories of the United Kingdom.

The `sovereignty` qualifier will filter countries by their sovereignty type. The following values are supported:

- `sovereign`
- `dependency`
- `overseas region`
- `partially_recognized`
- `unrecognized`
- `disputed`

### Tracking qualifiers

To filter countries by their visit status, use the `visited` qualifier:

```bash
region:europe visited:true
```

To filter countries that are in the 'want to visit' list, use the `wanttovisit` qualifier:

```bash
language:english wanttovisit:true
```

> <icon name="info"></icon> **Note**
>
> Tracking lists automatically apply the respective tracking qualifier when using the respective list.

#### Visit modifiers

When `visited:true` is applied, you can further narrow your search, based on your personal visit history. You can use the following modifiers:

| Modifier | Type                |                    Example | Notes                          |
| -------- | ------------------- | -------------------------: | ------------------------------ |
| `count`  | number (comparison) |    `visited:true count:>1` | Filters by visit count         |
| `year`   | number (comparison) |   `visited:true year:2020` | Filters by visit year          |
| `first`  | number (comparison) | `visited:true first:=2012` | Filters by year of first visit |
| `last`   | number (comparison) |  `visited:true last:=2018` | Filters by year of last visit  |

## Text matching

By default, search terms use prefix matching. The `match` modifier applies to text-based qualifier searches. It can be combined with a qualifier to control how its value is matched.

| Mode        | Description                                                   |
| ----------- | ------------------------------------------------------------- |
| `prefix`    | Matches values beginning with the query. This is the default. |
| `substring` | Matches values containing the query anywhere.                 |
| `exact`     | Matches the complete value.                                   |
| `regex`     | Matches using a regular expression.                           |

For example:

```bash
language:english match:exact
```

## Case and accent matching

Text qualifier values are matched **case-insensitively**. This means any uppercase characters will be treated as lowercase. For example:

```bash
region:AFRICA
```

Text matching ignores diacritics, so accented and unaccented characters are treated as equivalent.

## Quoted values

Quoted values allow a qualifier value containing whitespace to be treated as a single value. For example:

```bash
capital:"san jose"
```

Note that quoted values are only useful for qualifiers whose underlying values contain spaces. Quoted values do not convert or normalize qualifier values. When a qualifier uses canonical keys, use the key directly. For example:

```bash
subregion:western_europe
```

## Numeric comparisons

Numeric qualifiers and modifiers support the following comparison operators:

| Operator | Meaning                  |
| -------- | ------------------------ |
| `>`      | Greater than             |
| `<`      | Less than                |
| `>=`     | Greater than or equal to |
| `<=`     | Less than or equal to    |
| `~`      | Approximately equal to   |
| `=`      | Equal to                 |

For example:

```bash
population:>=1,000,000
```

```bash
area:~2000
```

## Boolean operators

The search supports boolean expressions. You can use `AND`, `OR` and `NOT` to combine various search terms.

By default, terms separated by whitespace will be equivalent to the `AND` operator. For example, the query `region:europe sovereign:true` is equivalent to `region:europe AND sovereign:true`, meaning that the query will return all sovereign countries in Europe.

You can use parentheses to achieve more complex expressions. For example:

```bash
(region:europe OR region:asia) currency:eur
```

`NOT` can also be combined with other conditions. For example:

```bash
region:europe NOT visited:true
```

Boolean operators follow standard precedence: `NOT` is evaluated first, followed by `AND`, then `OR`. Parentheses can be used to explicitly control evaluation order.

For example, the query `region:europe OR region:asia sovereign:true` will be interpreted as `region:europe OR (region:asia AND sovereign:true)`, returning all countries in Europe or all sovereign countries in Asia.
