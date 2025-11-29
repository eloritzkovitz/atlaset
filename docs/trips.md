#Trips

In Atlaset, **trips** let you record, organize, and analyze your travels. Each trip can include multiple countries, dates, categories, and notes. Trips power features like the visited countries overlay, timeline navigation, and trip statistics.

#### Trip JSON Fields

| Field       | Type      | Description                                       |
|-------------|-----------|---------------------------------------------------|
| `id`        | string    | Unique identifier for the trip (*optional*, generated if missing) |
| `name`      | string    | Name for the Trip                                 |
| `countries` | string[]  | Array of ISO 3166-1 country codes visited         |
| `startDate` | string    | Start date of the trip (ISO 8601 format)          |
| `endDate`   | string    | End date of the trip (ISO 8601 format)            |
| `category`  | string    | Array of ISO 3166-1 country codes                 |
| `notes`     | string    | Optional notes                                    |

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