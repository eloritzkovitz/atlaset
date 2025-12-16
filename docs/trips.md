#Trips

In Atlaset, **trips** let you record, organize, and analyze your travels. Each trip can include multiple countries, dates, categories, and notes. Trips power features like the visited countries overlay, timeline navigation, and trip statistics.

#### Trip JSON Fields

| Field       | Type     | Description                                                                             |
| ----------- | -------- | --------------------------------------------------------------------------------------- |
| `id`        | string   | Unique identifier for the trip (_optional_, generated if missing)                       |
| `name`      | string   | Name for the Trip                                                                       |
| `favorite`  | boolean  | _(optional)_ Whether this trip is marked as a favorite                                  |
| `rating`    | number   | _(optional)_ User rating for the trip (1 to 5 stars)                                    |
| `countries` | string[] | Array of ISO 3166-1 country codes visited                                               |
| `startDate` | string   | Start date of the trip (ISO 8601 format, optional for tentative trips)                  |
| `endDate`   | string   | End date of the trip (ISO 8601 format, optional for tentative trips)                    |
| `category`  | string   | _(optional)_ Category for the trip. Must be one of the supported categories. See below. |
| `tags`      | string[] | _(optional)_ Tags for the trip. Each must be one of the supported tags. See below.      |
| `notes`     | string   | _(optional)_ Notes                                                                      |

### Tentative Trips

If a trip has no `startDate` or `endDate`, it is considered _tentative_. In the UI, tentative trips will display "TBD" for dates and duration.

> **Note**
> When importing trips with categories, the category and each tag must match one of the supported values listed above. Invalid values will be ignored or may cause an error.  
> See the full list of [supported categories and tags](categories-and-tags.html).

## Adding Trips

### 1. From JSON/CSV Files

- You can import trips from JSON files or from CSV files:

**JSON:**

```json
{
  "name": "Summer in Europe",
  "countries": ["FR", "DE", "IT"],
  "startDate": "2023-07-01",
  "endDate": "2023-07-15",
  "category": "Vacation",
  "notes": "Visited Paris, Berlin, and Rome."
}
```

**CSV:**

```csv
name,countries,startDate,endDate,category,notes
Summer in Europe,"FR;DE;IT",2023-07-01,2023-07-15,Vacation,"Visited Paris, Berlin, and Rome."
```

[Download a full example trip JSON](../examples/trips.json)  
[Download a full example trip CSV](../examples/trips.csv)

### 2. Via the UI

- Use the Trips panel to create, edit, or delete trips.
- Fill in the trip name, select countries (by ISO code), set dates, choose a category, and add notes if desired.

## Importing/Exporting Trips

- Trips can be easily imported from and exported to JSON or CSV files.
- Use this to back up your trips or share them with others.

## Timeline & Overlays Integration

- Your trips power the Visited Countries overlay and timeline features.
- Changes to your trips are reflected in overlays and timeline coloring automatically.
