# Adding country fields

For automated addition of new fields and values to the country data, you can use the built-in [add-country-field.js script](/scripts/assets/add-country-field.js). The script reads a JSON map and appends the supplied values based on matching ISO 3166 Alpha-2 codes.

> - The script requires a mapping file (`--map`) that supplies values per-country.
> - Lookup uses a property on each country (default: `isoCode`) — override with `--mapKeyField`.
> - Map may be an object lookup or an array (converted with `--mapFrom`/`--mapTo`).

### **When to use**

- Add the same derived property across all countries (e.g. region groups, classification tags).
- Merge an external dataset (CSV/JSON) into your countries file via a JSON map.

## **Flags overview**

- `--file, -f` — Path to the JSON file to modify (default: `public/data/countries.json`).
- `--path, -k` — Dot-separated path for the field to add (required).
- `--map, -m` — Path to the mapping JSON file (required).
- `--mapKeyField` — Property on each country used to lookup the map key (default: `isoCode`).
- `--mapFrom` / `--mapTo` — When `--map` points to an array, these select the source/key and target/value fields to build the lookup.
- `--mapDefault` — JSON value to use when a lookup key is missing (e.g. `--mapDefault='"Unknown"'`).
- `--map-skip-missing` — Skip items with no mapping instead of setting a default.
- `--skip-existing` — Do not overwrite items that already have the target field.
- `--dry-run, -d` — Print what would change without writing the file.
- `--backup, -b` — Create a timestamped backup of the original file before writing (default: true).

## **Usage examples**

#### **Dry-run (no file written):**

```sh
node scripts/assets/add-country-field.js --file=public/data/countries.json --path=test --map=scripts/data/region-map.json --mapKeyField=isoCode --dry-run
```

#### **Apply changes (writes file and creates backup):**

```sh
node scripts/assets/add-country-field.js --file=public/data/countries.json --path=test --map=scripts/data/region-map.json --mapKeyField=isoCode
```

#### **Skip items without mapping:**

```sh
node scripts/assets/add-country-field.js --file=public/data/countries.json --path=test --map=scripts/data/region-map.json --mapKeyField=isoCode --map-skip-missing
```

## **Mapping formats**

#### **Object (simple lookup):**

```json
{
  "US": "Americas",
  "FR": "Europe",
  "CN": "Asia"
}
```

#### **Array (convert to lookup with `--mapFrom` / `--mapTo`):**

```json
[
  { "code": "US", "region": "Americas" },
  { "code": "FR", "region": "Europe" }
]
```

Run with:

```sh
node scripts/assets/add-country-field.js --file=public/data/countries.json --path=test --map=scripts/data/region-array.json --mapFrom=code --mapTo=region --mapKeyField=isoCode
```

## **Inspecting available keys**

To see which properties are available on a country object (so you can choose `--mapKeyField`), run:

```sh
node -e "const fs=require('fs');const d=JSON.parse(fs.readFileSync('public/data/countries.json','utf8'));console.log(Object.keys(Array.isArray(d)?d[0]:d));"
```

## **Generating a starter map**

If you don't have a mapping file yet, use the [generate-empty-map.js script](/scripts/assets/generate-empty-map.js) to create an empty object or array map derived from your countries.json file.

- Object-style (simple lookup, default):

```sh
node scripts/assets/generate-empty-map.js --file=scripts/assets/countries.json --out=scripts/data/test-empty-map.json --format=object --default=null --overwrite
```

- Array-style (list of entries):

```sh
node scripts/assets/generate-empty-map.js --file=scripts/assets/countries.json --out=scripts/data/test-empty-map.json --format=array --default=null --overwrite
```

- Useful flags:
  - `--default=VALUE` — JSON literal to use for each key (e.g. `--default=null`, `--default=true`, `--default='""'`).
  - `--key=FIELD` — use a different key field than `isoCode` (default: `isoCode`).
  - `--dry-run` — show what would be written without changing files.
  - `--overwrite` — replace an existing output file.

After generating, pass the produced map to `add-country-field.js` via `--map`.

> **Notes**
>
> - Use `--mapDefault` with JSON syntax when you want a literal string default (e.g. `--mapDefault='"Unknown"'`).
> - `--skip-existing` prevents overwriting fields already set in the JSON.
