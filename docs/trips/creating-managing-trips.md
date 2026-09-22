# Creating and managing trips

You can create trips directly or import them from JSON or CSV files.

## Creating trips

- Click <icon name="add"></icon> **Add trip** to open the trip editor.
- Fill in the required fields and any optional information you want to include.
- Click <icon name="add"></icon> **Add trip** to create the trip.

### Tentative trips

If a trip has no `startDate` or `endDate`, it is considered _tentative_. In the UI, tentative trips will display `TBD` for dates and duration.

## Trip status

A trip's status is based on `startDate` and is calculated according to the following guidelines:

- **Planned**: A future **tentative trip**, which has no `startDate` or `endDate`.
- **Upcoming**: A future trip, which has valid `startDate` and `endDate`.
- **In Progress**: A trip that is currently ongoing.
- **Completed**: A trip that has already ended.

You can also manually control a trip's status:

- Trips can be manually marked as **Completed** if their start date has already passed or is today.
- **Planned** and **Upcoming** trips can be manually marked as **Cancelled** and archived.
- In the case that a cancelled trip is restored, its status will be calculated automatically.

> <icon name="info"></icon> **Note**
>
> When importing trips with categories, the category and each tag must match one of the supported values listed above. Invalid values will be ignored or may cause an error.  
> See the full list of [supported categories and tags](/docs/trips/categories-and-tags.html).

## Importing/exporting trips

- You can import trips from `JSON` files or from `CSV` files:

**JSON:**

```json
{
  "name": "Summer in Europe",
  "countries": ["FR", "DE", "IT"],
  "startDate": "2023-07-01",
  "endDate": "2023-07-15",
  "category": "Vacation",
  "notes": "Visited Paris, Berlin and Rome."
}
```

**CSV:**

```csv
name,countries,startDate,endDate,category,notes
Summer in Europe,"FR;DE;IT",2023-07-01,2023-07-15,Vacation,"Visited Paris, Berlin and Rome."
```

[Download a full example trip JSON](/docs/examples/trips.json)  
[Download a full example trip CSV](/docs/examples/trips.csv)

> <icon name="tip"></icon> **Tip**
>
> Export your trip data regularly for backup. You can import exported JSON/CSV files back into the app at any time!
